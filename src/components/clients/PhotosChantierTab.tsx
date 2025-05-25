import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PhotoGallery } from './photos/PhotoGallery';
import { PhotoSelectionPanel } from './photos/PhotoSelectionPanel';
import { PhotoModeSelector } from './photos/PhotoModeSelector';
import { SafetyCultureService } from '@/services/safetyCultureService';
import { generatePhotosWordDocument } from '@/services/photosWordService';
import { createDocument } from '@/services/supabase/documentService';
import type { SafetyCultureAudit, SafetyCulturePhoto, SelectedPhoto } from '@/types/safetyCulture';

interface PhotosChantierTabProps {
  clientId: string;
  clientName?: string;
  safetyCultureAuditId?: string;
  onDocumentGenerated?: () => void;
}

export type SelectionMode = 'avant' | 'apres';

const PhotosChantierTab = ({ 
  clientId, 
  clientName = 'Client', 
  safetyCultureAuditId,
  onDocumentGenerated
}: PhotosChantierTabProps) => {
  const [audits, setAudits] = useState<SafetyCultureAudit[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string>(safetyCultureAuditId || '');
  const [photos, setPhotos] = useState<SafetyCulturePhoto[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<{
    avant: SelectedPhoto[];
    apres: SelectedPhoto[];
  }>({ avant: [], apres: [] });
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('avant');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [client, setClient] = useState<any>(null);
  const { toast } = useToast();

  // Charger les inspections disponibles
  useEffect(() => {
    loadAudits();
    loadClientData();
  }, []);

  // Charger les photos quand une inspection est sélectionnée
  useEffect(() => {
    if (selectedAuditId) {
      loadPhotos(selectedAuditId);
    }
  }, [selectedAuditId]);

  const loadClientData = async () => {
    try {
      // Récupérer les données du client depuis le localStorage ou API
      const clientData = JSON.parse(localStorage.getItem(`client_${clientId}`) || '{}');
      setClient(clientData);
    } catch (error) {
      console.error('Erreur lors du chargement des données client:', error);
    }
  };

  const loadAudits = async () => {
    try {
      setLoading(true);
      const auditsList = await SafetyCultureService.getAudits();
      setAudits(auditsList);
      
      if (safetyCultureAuditId && auditsList.some(audit => audit.id === safetyCultureAuditId)) {
        setSelectedAuditId(safetyCultureAuditId);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des inspections:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les inspections SafetyCulture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (auditId: string) => {
    try {
      setLoading(true);
      const auditPhotos = await SafetyCultureService.getAuditPhotos(auditId);
      setPhotos(auditPhotos);
      
      // Réinitialiser les sélections
      setSelectedPhotos({ avant: [], apres: [] });
      
      toast({
        title: "Photos chargées",
        description: `${auditPhotos.length} photo(s) trouvée(s) dans l'inspection`,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les photos de l'inspection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (photo: SafetyCulturePhoto) => {
    const currentSelection = selectedPhotos[selectionMode];
    const isSelected = currentSelection.some(p => p.photo.id === photo.id);
    
    if (isSelected) {
      // Retirer la photo et réorganiser les numéros
      const newSelection = currentSelection
        .filter(p => p.photo.id !== photo.id)
        .map((p, index) => ({ ...p, order: index + 1 }));
      
      setSelectedPhotos(prev => ({
        ...prev,
        [selectionMode]: newSelection
      }));
    } else {
      // Ajouter la photo si limite pas atteinte (exactement 4)
      if (currentSelection.length < 4) {
        const newSelectedPhoto: SelectedPhoto = {
          photo,
          order: currentSelection.length + 1
        };
        setSelectedPhotos(prev => ({
          ...prev,
          [selectionMode]: [...prev[selectionMode], newSelectedPhoto]
        }));
      } else {
        toast({
          title: "Limite atteinte",
          description: `Maximum 4 photos ${selectionMode.toUpperCase()}`,
          variant: "destructive",
        });
      }
    }
  };

  const handlePhotoRemove = (photoId: string, mode: SelectionMode) => {
    const newSelection = selectedPhotos[mode]
      .filter(p => p.photo.id !== photoId)
      .map((p, index) => ({ ...p, order: index + 1 }));
    
    setSelectedPhotos(prev => ({
      ...prev,
      [mode]: newSelection
    }));
  };

  const handleReorderPhotos = (mode: SelectionMode, reorderedPhotos: SelectedPhoto[]) => {
    const updatedPhotos = reorderedPhotos.map((photo, index) => ({
      ...photo,
      order: index + 1
    }));
    
    setSelectedPhotos(prev => ({
      ...prev,
      [mode]: updatedPhotos
    }));
  };

  const generateDocument = async () => {
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
      
      const selectedAudit = audits.find(audit => audit.id === selectedAuditId);
      
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

      // Générer le document Word
      const wordBlob = await generatePhotosWordDocument(reportData);
      
      // Convertir le blob en base64 pour stockage
      const arrayBuffer = await wordBlob.arrayBuffer();
      const base64data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      console.log('Document généré, taille:', wordBlob.size);
      
      // Créer l'enregistrement du document dans Supabase
      const documentRecord = await createDocument({
        name: '4-Fotos.docx',
        type: 'fotos',
        status: 'generated',
        client_id: clientId,
        content: base64data
      });

      if (documentRecord) {
        console.log('Document enregistré dans Supabase:', documentRecord);
        
        toast({
          title: "✅ Document créé",
          description: "4-Fotos.docx a été ajouté au dossier client",
        });
        
        // Notifier la génération du document
        if (onDocumentGenerated) {
          onDocumentGenerated();
        }
        
        // Déclencher un événement personnalisé pour actualiser les documents
        window.dispatchEvent(new CustomEvent('document-generated', { 
          detail: { 
            clientId, 
            documentType: 'fotos',
            documentName: '4-Fotos.docx'
          } 
        }));
        
        // Réinitialiser les sélections
        setSelectedPhotos({ avant: [], apres: [] });
      } else {
        throw new Error('Impossible d\'enregistrer le document');
      }
      
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le document",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const canGenerate = selectedPhotos.avant.length === 4 && selectedPhotos.apres.length === 4;
  const totalSelectedPhotos = selectedPhotos.avant.length + selectedPhotos.apres.length;

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection d'inspection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos de Chantier - 4-Fotos.docx
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sélection de 4 photos AVANT et 4 photos APRÈS pour {clientName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline"
                className={canGenerate ? 'border-green-500 text-green-700' : ''}
              >
                {totalSelectedPhotos}/8 photos sélectionnées
              </Badge>
              <Button
                onClick={generateDocument}
                disabled={generating || !canGenerate}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                {generating ? 'Génération...' : 'Générer 4-Fotos.docx'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Sélectionner une inspection :
              </label>
              <Select
                value={selectedAuditId}
                onValueChange={setSelectedAuditId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une inspection SafetyCulture..." />
                </SelectTrigger>
                <SelectContent>
                  {audits.map((audit) => (
                    <SelectItem key={audit.id} value={audit.id}>
                      {audit.title} - {new Date(audit.created_at).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Photos disponibles</div>
              <div className="text-2xl font-bold">{photos.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface de sélection */}
      {selectedAuditId && photos.length > 0 && (
        <div className="grid grid-cols-12 gap-6 h-[600px]">
          {/* Galerie de photos (gauche) */}
          <div className="col-span-5">
            <PhotoGallery
              photos={photos}
              selectedPhotos={selectedPhotos}
              selectionMode={selectionMode}
              onPhotoSelect={handlePhotoSelect}
              loading={loading}
            />
          </div>

          {/* Sélecteur de mode (centre) */}
          <div className="col-span-2">
            <PhotoModeSelector
              mode={selectionMode}
              onModeChange={setSelectionMode}
              selectedCounts={{
                avant: selectedPhotos.avant.length,
                apres: selectedPhotos.apres.length
              }}
            />
          </div>

          {/* Panneau de sélection (droite) */}
          <div className="col-span-5">
            <PhotoSelectionPanel
              selectedPhotos={selectedPhotos}
              onPhotoRemove={handlePhotoRemove}
              onReorderPhotos={handleReorderPhotos}
            />
          </div>
        </div>
      )}

      {/* État vide */}
      {!selectedAuditId && (
        <Card>
          <CardContent className="text-center p-8">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sélectionner une inspection</h3>
            <p className="text-muted-foreground">
              Choisissez une inspection SafetyCulture pour commencer la sélection des photos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotosChantierTab;
