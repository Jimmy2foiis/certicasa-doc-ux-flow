
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TemplateTag } from "@/components/documents/template-mapping/types";
import { getTemplateById, createDocument, fetchClientDataForMapping } from "@/services/documentService";
import { processDocumentContent, prepareDocumentData } from "@/utils/documentUtils";
import { downloadDocument } from "@/utils/downloadUtils";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: (documentId: string) => void, clientName?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string, clientId?: string, mappings?: TemplateTag[]) => Promise<void>;
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

  // Function to generate a document
  const handleGenerate = async (templateId: string, clientId?: string, mappings?: TemplateTag[]) => {
    setGenerating(true);

    try {
      // Get the template data
      const templateData = await getTemplateById(templateId);
      
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
  const handleDownload = () => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à télécharger.",
        variant: "destructive",
      });
      return;
    }

    const success = downloadDocument(documentId);
    
    if (success) {
      toast({
        title: "Téléchargement",
        description: "Le téléchargement du document a commencé.",
      });
    }
  };

  return {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload
  };
};
