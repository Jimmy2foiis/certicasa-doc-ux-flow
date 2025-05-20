
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

  // Use our notification hook
  useTemplateNotification();

  // Use the template storage hook
  const { saveAllTemplates } = useTemplateStorage(resetUploadedFiles);

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
