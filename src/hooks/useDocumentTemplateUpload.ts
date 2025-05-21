
import { useFileUpload } from "./useFileUpload";
import { useTemplateStorage } from "./useTemplateStorage";
import { useTemplateNotification } from "./useTemplateNotification";

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

  // Utiliser notre hook de notification
  const { showNotification } = useTemplateNotification();

  // Utiliser le hook de stockage des modèles
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
