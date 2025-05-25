
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePhotosWordDocument } from '@/services/photos/photosWordService';
import { createDocument } from '@/services/supabase/documentService';
import type { SafetyCultureAudit, SelectedPhoto } from '@/types/safetyCulture';

interface UseDocumentGenerationProps {
  clientId: string;
  clientName: string;
  onDocumentGenerated?: () => void;
}

export const useDocumentGeneration = ({
  clientId,
  clientName,
  onDocumentGenerated
}: UseDocumentGenerationProps) => {
  const [generating, setGenerating] = useState(false);
  const [client, setClient] = useState<any>(null);
  const { toast } = useToast();

  const loadClientData = async () => {
    try {
      const clientData = JSON.parse(localStorage.getItem(`client_${clientId}`) || '{}');
      setClient(clientData);
    } catch (error) {
      console.error('Erreur lors du chargement des données client:', error);
    }
  };

  const generateDocument = async (
    selectedPhotos: { avant: SelectedPhoto[]; apres: SelectedPhoto[] },
    selectedAudit: SafetyCultureAudit | undefined
  ) => {
    if (selectedPhotos.avant.length !== 4 || selectedPhotos.apres.length !== 4) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner exactement 4 photos AVANT et 4 photos APRÈS",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(true);
      console.log('=== DÉBUT GÉNÉRATION DOCUMENT PHOTOS ===');
      
      await loadClientData();
      
      const reportData = {
        clientName,
        projectTitle: selectedAudit?.title || 'Inspection chantier',
        auditDate: selectedAudit?.created_at || new Date().toISOString(),
        refCatastral: client?.cadastralReference || client?.refCatastral || 'N/A',
        coordenadasUTM: client?.utmCoordinates || client?.coordenadasUTM || 'N/A',
        photosAvant: selectedPhotos.avant.sort((a, b) => a.order - b.order),
        photosApres: selectedPhotos.apres.sort((a, b) => a.order - b.order)
      };

      console.log('Génération du document avec données:', reportData);

      const wordBlob = await generatePhotosWordDocument(reportData);
      console.log('✅ Document Word généré, taille:', wordBlob.size);
      
      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            console.log('✅ Conversion base64 réussie, taille:', base64.length);
            resolve(base64);
          };
          reader.onerror = (error) => {
            console.error('❌ Erreur conversion base64:', error);
            reject(error);
          };
          reader.readAsDataURL(blob);
        });
      };
      
      const base64data = await blobToBase64(wordBlob);
      
      console.log('Sauvegarde dans Supabase...');
      const documentRecord = await createDocument({
        name: 'Informe fotográfico',
        type: 'fotos',
        status: 'generated',
        client_id: clientId,
        content: base64data
      });

      if (documentRecord) {
        console.log('✅ Document enregistré dans Supabase:', documentRecord.id);
        
        toast({
          title: "✅ Document créé",
          description: "Informe fotográfico a été ajouté au dossier client",
        });
        
        if (onDocumentGenerated) {
          onDocumentGenerated();
        }
        
        setTimeout(() => {
          console.log('🔄 Déclenchement événement document-generated');
          window.dispatchEvent(new CustomEvent('document-generated', { 
            detail: { 
              clientId, 
              documentType: 'fotos',
              documentName: 'Informe fotográfico',
              documentId: documentRecord.id
            } 
          }));
        }, 1000);
        
        console.log('=== FIN GÉNÉRATION DOCUMENT PHOTOS ===');
        return true;
      } else {
        throw new Error('❌ Impossible d\'enregistrer le document dans Supabase');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de générer le document",
        variant: "destructive",
      });
      return false;
    } finally {
      setGenerating(false);
    }
  };

  return {
    generating,
    generateDocument
  };
};
