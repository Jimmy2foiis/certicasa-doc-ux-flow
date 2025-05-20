
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DOCUMENT_TEMPLATES_KEY } from "@/components/documents/DocumentTemplateUpload";
import { useFileUpload } from "./useFileUpload";
import { useTemplateStorage } from "./useTemplateStorage";

export const useDocumentTemplateUpload = () => {
  const { toast } = useToast();
  const {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    resetUploadedFiles
  } = useFileUpload();

  const { saveAllTemplates } = useTemplateStorage(resetUploadedFiles);

  // Load existing templates from localStorage on load
  useEffect(() => {
    // We just load them to display an information message
    try {
      const storedTemplates = localStorage.getItem(DOCUMENT_TEMPLATES_KEY);
      if (storedTemplates) {
        const existingTemplates = JSON.parse(storedTemplates);
        if (existingTemplates.length > 0) {
          toast({
            title: "Modèles disponibles",
            description: `${existingTemplates.length} modèle(s) sont disponibles dans votre bibliothèque.`,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement initial des modèles:", error);
    }
  }, [toast]);

  // Wrapper to save all templates
  const saveAllTemplatesToLibrary = () => {
    saveAllTemplates(uploadedFiles);
  };

  return {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    saveAllTemplates: saveAllTemplatesToLibrary
  };
};
