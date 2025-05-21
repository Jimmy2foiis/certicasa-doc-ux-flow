import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadedFile } from "@/components/documents/TemplateFileItem";

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Validation - only accept .docx or .pdf files
    const validFiles: UploadedFile[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(files).forEach(file => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'docx' || fileExt === 'pdf') {
        // Create a copy of the file with additional properties
        const uploadedFile: UploadedFile = {
          id: `${file.name}-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          progress: 0,
          status: 'uploading',
          content: null, // Initialize with null, will be populated when needed
          slice: file.slice,
          stream: file.stream?.bind(file),
          text: file.text?.bind(file),
          arrayBuffer: file.arrayBuffer?.bind(file),
        };
        
        validFiles.push(uploadedFile);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Format de fichier non supporté",
        description: `Les fichiers suivants ne sont pas au format .docx ou .pdf: ${invalidFiles.join(', ')}`,
        variant: "destructive"
      });
    }
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      
      // Simulate upload progress for each file
      validFiles.forEach(file => {
        simulateFileUpload(file.id);
      });
    }
    
    // Reset file input
    e.target.value = '';
  };
  
  // Simulate file upload with progress
  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, progress: 100, status: 'complete' } 
              : file
          )
        );
        
        // Check if all files are complete
        setTimeout(() => {
          const allComplete = uploadedFiles.every(file => 
            file.id === fileId ? true : file.status === 'complete'
          );
          
          if (allComplete) {
            setUploading(false);
            toast({
              title: "Modèles téléversés avec succès",
              description: "Tous les modèles ont été ajoutés avec succès.",
            });
          }
        }, 300);
      } else {
        setUploadedFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, progress: Math.min(progress, 99) } 
              : file
          )
        );
      }
    }, 200);
  };
  
  const confirmDeleteFile = (fileId: string) => {
    setFileToDelete(fileId);
  };
  
  const handleDeleteFile = () => {
    if (fileToDelete) {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileToDelete));
      
      toast({
        title: "Modèle supprimé",
        description: "Le modèle a été supprimé avec succès.",
      });
      
      setFileToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setFileToDelete(null);
  };

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
