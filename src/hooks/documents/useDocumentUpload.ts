
import { useToast } from "@/hooks/use-toast";

export const useDocumentUpload = (
  handleDocumentAction: (documentId: string, action: string, additionalData?: any) => void
) => {
  const { toast } = useToast();

  const handleUploadDocument = (file: File, documentType: string) => {
    toast({
      title: "Upload en cours",
      description: `Upload de ${file.name}...`,
    });

    // Generate a temporary ID for the new document
    const tempId = Math.random().toString(36).substring(2);
    
    // Call handleDocumentAction with 'upload' action and additional data
    handleDocumentAction(tempId, 'upload', {
      file: file,
      name: file.name,
      type: documentType
    });
  };

  return { handleUploadDocument };
};
