
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TemplateTag } from "@/components/documents/template-mapping/types";
import { getTemplateById, createDocument, fetchClientDataForMapping } from "@/services/documentService";
import { processDocumentContent, prepareDocumentData } from "@/utils/documentUtils";
import { downloadDocument, saveDocumentToFolder } from "@/utils/downloadUtils";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: (documentId: string) => void, clientName?: string, clientId?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string, clientId?: string, mappings?: TemplateTag[]) => Promise<void>;
    handleDownload: () => void;
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

  // Function to generate a document
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
      console.log("Generating document from template:", templateId);
      console.log("Client ID:", clientId);
      console.log("Mappings:", mappings);
      
      // Get the template data
      const templateData = await getTemplateById(templateId);
      
      if (!templateData || !templateData.content) {
        throw new Error("Le modèle sélectionné est vide ou invalide");
      }
      
      // Fetch client data if we have client ID and mappings
      let documentContent = templateData.content;
      if (clientId && mappings && mappings.length > 0) {
        console.log("Applying mappings to document:", mappings);
        const clientData = await fetchClientDataForMapping(clientId);
        documentContent = processDocumentContent(documentContent, mappings, clientData);
      }

      // Prepare the document data
      const documentData = prepareDocumentData(
        templateData,
        clientName,
        clientId,
        documentContent
      );

      // Create the document
      const document = await createDocument(documentData);
      console.log("Document generated successfully:", document);
      
      setDocumentId(document.id);
      
      // Simulate a delay for the user experience
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
      console.error("Generation error:", error);
      setGenerating(false);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  // Function to download a document
  const handleDownload = async () => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à télécharger.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await downloadDocument(documentId);
      
      if (success) {
        toast({
          title: "Téléchargement",
          description: "Le téléchargement du document a commencé.",
        });
      } else {
        throw new Error("Impossible de télécharger le document");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
    }
  };
  
  // Function to save document to client folder
  const handleSaveToFolder = async () => {
    if (!documentId || !clientId) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer ce document. Informations manquantes.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      console.log("Saving document to folder:", documentId, "for client:", clientId);
      const success = await saveDocumentToFolder(documentId, clientId);
      
      if (success) {
        toast({
          title: "Document enregistré",
          description: "Le document a été enregistré dans le dossier du client.",
        });
        return true;
      } else {
        throw new Error("Impossible d'enregistrer le document dans le dossier");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload,
    handleSaveToFolder
  };
};
