
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadedFile } from "@/types/documents";
import { DocumentExtractionService } from "@/services/documentExtraction";

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    try {
      // Process each file
      for (const file of Array.from(files)) {
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
          extractedText: '',
          variables: [],
        };
        
        newFiles.push(uploadedFile);
        setUploadedFiles(prev => [...prev, uploadedFile]);
        
        try {
          // Lire le contenu du fichier
          const reader = new FileReader();
          
          // Mettre à jour la progression
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setUploadedFiles(prevFiles => 
                prevFiles.map(f => 
                  f.id === fileId ? { ...f, progress } : f
                )
              );
            }
          };
          
          // Extraire le texte et les variables du fichier
          const extractionResult = await DocumentExtractionService.extractTextAndVariables(file);
          
          // Lire le fichier en tant que data URL
          const contentPromise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          const content = await contentPromise;
          
          // Mettre à jour le fichier avec le contenu et les variables extraites
          setUploadedFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileId 
                ? { 
                    ...f, 
                    status: extractionResult.error ? 'error' : 'complete',
                    progress: 100,
                    content,
                    extractedText: extractionResult.text,
                    variables: extractionResult.variables
                  } 
                : f
            )
          );
          
          // Si une erreur d'extraction est survenue, afficher un toast d'avertissement
          if (extractionResult.error) {
            toast({
              title: "Avertissement",
              description: extractionResult.error,
              variant: "default",
            });
          }
        } catch (error) {
          console.error(`Erreur lors du traitement du fichier ${file.name}:`, error);
          
          setUploadedFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileId 
                ? { ...f, status: 'error', progress: 100 } 
                : f
            )
          );
          
          toast({
            title: "Erreur de téléchargement",
            description: `Impossible de traiter ${file.name}: ${error instanceof Error ? error.message : String(error)}`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erreur globale lors du téléchargement:", error);
      toast({
        title: "Erreur de téléchargement",
        description: `Une erreur s'est produite lors du téléchargement des fichiers: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      
      // Reset the input value to allow uploading the same file again
      event.target.value = '';
    }
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
