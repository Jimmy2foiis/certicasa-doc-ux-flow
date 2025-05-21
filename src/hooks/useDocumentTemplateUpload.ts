
import { useFileUpload } from "./useFileUpload";
import { useTemplateStorage } from "./useTemplateStorage";
import { useToast } from "@/hooks/use-toast";
import { UploadedFile } from "@/types/documents";

export const useDocumentTemplateUpload = () => {
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

  const { toast } = useToast();

  const showNotification = (title: string, description: string, variant?: "default" | "destructive") => {
    toast({
      title,
      description,
      variant
    });
  };

  const { saveAllTemplates } = useTemplateStorage(resetUploadedFiles);

  return {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    saveAllTemplates,
    showNotification
  };
};
