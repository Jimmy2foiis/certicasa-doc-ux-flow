
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TemplateTag } from "@/components/documents/template-mapping/types";
import { processDocumentContent, prepareDocumentData } from "@/utils/documentUtils";
import { fetchTemplateById, createDocument } from "@/utils/documentStorage";
import { fetchClientData } from "@/utils/clientDataUtils";
import { useDocumentActions } from "@/hooks/useDocumentActions";
import { useTemplateStorage } from "@/hooks/useTemplateStorage";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: ((documentId: string) => void) | undefined, clientName?: string, clientId?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string, clientId?: string, mappings?: TemplateTag[]) => Promise<void>;
    handleDownload: () => Promise<void>;
    handleSaveToFolder: () => Promise<boolean>;
  };
}

export const useDocumentGeneration: UseDocumentGenerationProps = (
  onDocumentGenerated,
  clientName,
  clientId
) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { toast } = useToast();
  const { getTemplateById } = useTemplateStorage(() => {});
  
  // Use document actions hook for download and save
  const documentActions = useDocumentActions({ documentId });

  // Fonction pour générer un document
  const handleGenerate = async (templateId: string, clientId?: string, mappings?: TemplateTag[]) => {
    if (!templateId) {
      toast({
        title: "Erreur",
        description: "Aucun modèle sélectionné.",
        variant: "destructive",
      });
      return;
    }
    
    setGenerating(true);

    try {
      console.log("Génération de document à partir du template:", templateId);
      console.log("ID client:", clientId);
      console.log("Mappings:", mappings);
      
      // Obtenir les données du template
      const templateData = await fetchTemplateById(templateId);
      
      if (!templateData) {
        throw new Error("Le modèle sélectionné n'existe pas");
      }
      
      if (!templateData.content) {
        throw new Error("Le modèle sélectionné est vide ou invalide");
      }
      
      // Récupérer les données client si nous avons un ID client et des mappings
      let documentContent = templateData.content;
      if (clientId && mappings && mappings.length > 0) {
        console.log("Application des mappings au document:", mappings);
        const clientData = await fetchClientData(clientId);
        
        if (!clientData || Object.keys(clientData).length === 0) {
          console.warn("Les données client sont vides pour l'ID client:", clientId);
        }
        
        documentContent = processDocumentContent(documentContent, mappings, clientData);
      }

      // Préparer les données du document
      const documentData = prepareDocumentData(
        templateData,
        clientName || "Document sans nom",
        clientId,
        documentContent
      );

      // Créer le document
      const document = await createDocument(documentData);
      
      if (!document || !document.id) {
        throw new Error("Erreur lors de la création du document");
      }
      
      console.log("Document généré avec succès:", document);
      
      setDocumentId(document.id);
      
      // Simuler un délai pour l'expérience utilisateur
      setTimeout(() => {
        setGenerating(false);
        setGenerated(true);
        
        if (onDocumentGenerated) {
          onDocumentGenerated(document.id);
        }
        
        toast({
          title: "Document généré",
          description: "Le document a été généré avec succès.",
        });
      }, 1500);

    } catch (error) {
      console.error("Erreur de génération:", error);
      setGenerating(false);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  return {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload: documentActions.handleDownload,
    handleSaveToFolder: documentActions.handleSaveToFolder
  };
};
