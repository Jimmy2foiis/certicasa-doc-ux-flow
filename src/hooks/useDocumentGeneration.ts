
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: (documentId: string) => void, clientName?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string) => Promise<void>;
    handleDownload: () => void;
  };
}

export const useDocumentGeneration: UseDocumentGenerationProps = (
  onDocumentGenerated,
  clientName
) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour générer un document
  const handleGenerate = async (templateId: string) => {
    setGenerating(true);

    try {
      // Récupérer les informations du template
      const { data: templateData, error: templateError } = await supabase
        .from('document_templates')
        .select('name, type')
        .eq('id', templateId)
        .single();
      
      if (templateError) {
        console.error("Erreur lors de la récupération du template:", templateError);
        throw new Error("Template introuvable");
      }

      // Préparer les données du document
      const documentData = {
        name: `${templateData.name} - ${clientName || 'Nouveau document'}`,
        type: templateData.type,
        status: 'generated',
        client_id: null, // À remplacer par l'ID client réel si disponible
        created_at: new Date().toISOString()
      };

      // Insérer le document dans Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select();
      
      if (error) {
        console.error("Erreur lors de la génération du document:", error);
        throw new Error("Impossible de générer le document");
      }

      console.log("Document généré avec succès:", data[0]);
      setDocumentId(data[0].id);
      
      // Simuler un délai pour l'expérience utilisateur
      setTimeout(() => {
        setGenerating(false);
        setGenerated(true);
        
        if (onDocumentGenerated) {
          onDocumentGenerated(data[0].id);
        }
        
        toast({
          title: "Document généré",
          description: "Le document a été généré avec succès.",
        });
      }, 1500);

    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setGenerating(false);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  // Fonction pour télécharger un document
  const handleDownload = () => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à télécharger.",
        variant: "destructive",
      });
      return;
    }

    // Simuler un téléchargement (dans une application réelle, utiliser Storage ou une URL)
    console.log(`Téléchargement du document ${documentId}`);
    
    toast({
      title: "Téléchargement",
      description: "Le téléchargement du document a commencé.",
    });
    
    // Dans une application réelle, vous pourriez utiliser quelque chose comme:
    // const { data } = await supabase.storage.from('documents').download(`path/to/${documentId}`);
    // const url = URL.createObjectURL(data);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'document.pdf';
    // a.click();
  };

  return {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload
  };
};
