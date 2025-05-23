
import { useState, useCallback } from "react";
import { DocumentTemplate, UploadedFile } from "@/types/documents";
import { useToast } from "@/components/ui/use-toast";
import { useTemplateStorage } from "./useTemplateStorage";

export const useDocumentTemplateUpload = (resetUploadedFiles: () => void) => {
  const [uploadingTemplates, setUploadingTemplates] = useState<boolean>(false);
  const { toast } = useToast();
  const { saveTemplate } = useTemplateStorage();

  const uploadFilesAsTemplates = useCallback(async (files: UploadedFile[]) => {
    if (!files || files.length === 0) {
      toast({
        title: "Aucun fichier à importer",
        description: "Veuillez sélectionner au moins un fichier.",
        variant: "default",
      });
      return [];
    }
    
    setUploadingTemplates(true);
    
    try {
      const createdTemplates: DocumentTemplate[] = [];
      
      // Process each file
      for (const file of files) {
        if (!file.content) {
          console.error("Missing content in file:", file.name);
          continue;
        }
        
        const templateData: Partial<DocumentTemplate> = {
          name: file.name,
          type: file.type,
          content: file.content,
          description: `Modèle importé depuis ${file.name}`,
          size: file.size,
          dateUploaded: new Date().toISOString(),
          lastModified: new Date(file.lastModified).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Save the template
        const newTemplate = saveTemplate(templateData);
        createdTemplates.push(newTemplate);
      }
      
      if (createdTemplates.length > 0) {
        toast({
          title: "Import réussi",
          description: `${createdTemplates.length} modèle${createdTemplates.length > 1 ? 's' : ''} importé${createdTemplates.length > 1 ? 's' : ''} avec succès.`
        });
        
        resetUploadedFiles();
      }
      
      return createdTemplates;
    } catch (error) {
      console.error("Error uploading templates:", error);
      
      toast({
        title: "Erreur d'import",
        description: "Une erreur s'est produite lors de l'import des modèles.",
        variant: "destructive"
      });
      
      return [];
    } finally {
      setUploadingTemplates(false);
    }
  }, [toast, saveTemplate, resetUploadedFiles]);

  return {
    uploadingTemplates,
    uploadFilesAsTemplates
  };
};
