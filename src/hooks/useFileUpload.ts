
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UploadedFile } from "@/types/documents"; // Update import to use the type from documents.ts

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    // Process each file
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      
      // Create a unique ID for the file
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        status: 'uploading',
        progress: 0,
        content: null,
        slice: file.slice,
        stream: (file as any).stream,
        text: file.text,
        arrayBuffer: file.arrayBuffer,
      };
      
      newFiles.push(uploadedFile);
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadedFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileId 
                ? { ...f, progress } 
                : f
            )
          );
        }
      };
      
      reader.onload = () => {
        setUploadedFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileId 
              ? { 
                  ...f, 
                  status: 'complete', 
                  progress: 100, 
                  content: reader.result as string 
                } 
              : f
          )
        );
      };
      
      reader.onerror = () => {
        setUploadedFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileId 
              ? { ...f, status: 'error' } 
              : f
          )
        );
        
        toast({
          title: "Erreur de téléchargement",
          description: `Impossible de télécharger ${file.name}`,
          variant: "destructive",
        });
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
    });
    
    // Add the new files to the state
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Reset the uploading state when all files are processed
    setTimeout(() => setUploading(false), 500);
    
    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  // Confirm delete file
  const confirmDeleteFile = (fileId: string) => {
    setFileToDelete(fileId);
  };

  // Delete a file
  const handleDeleteFile = () => {
    if (fileToDelete) {
      setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileToDelete));
      setFileToDelete(null);
      
      toast({
        title: "Fichier supprimé",
        description: "Le fichier a été supprimé avec succès",
      });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setFileToDelete(null);
  };
  
  // Reset all uploaded files
  const resetUploadedFiles = () => {
    setUploadedFiles([]);
  };

  return {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    resetUploadedFiles
  };
};
