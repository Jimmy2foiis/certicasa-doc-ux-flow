
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
          // Mettre à jour la progression
          const updateProgress = (progress: number) => {
            setUploadedFiles(prevFiles => 
              prevFiles.map(f => 
                f.id === fileId ? { ...f, progress } : f
              )
            );
          };
          
          updateProgress(20); // Démarrage de l'extraction
          
          // Extraire le texte et les variables du fichier
          const extractionResult = await DocumentExtractionService.extractTextAndVariables(file);
          
          updateProgress(60); // Extraction terminée
          
          // Vérifier si l'extraction a produit du texte
          if (!extractionResult.text || extractionResult.text.trim().length === 0) {
            throw new Error(extractionResult.error || "Le fichier semble être vide ou ne contient pas de texte extractible.");
          }

          // Lire le fichier en tant que data URL pour le stockage
          const content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (!reader.result) {
                reject(new Error("Échec de lecture du fichier"));
                return;
              }
              resolve(reader.result as string);
            };
            reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
            reader.readAsDataURL(file);
          });
          
          updateProgress(100); // Lecture terminée
          
          // Mettre à jour le fichier avec le contenu et les variables extraites
          setUploadedFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileId 
                ? { 
                    ...f, 
                    status: 'complete',
                    progress: 100,
                    content,
                    extractedText: extractionResult.text,
                    variables: extractionResult.variables
                  } 
                : f
            )
          );
          
          // Notifier si aucune variable n'est détectée
          if (extractionResult.variables.length === 0) {
            toast({
              title: "Information",
              description: `Aucune variable n'a été détectée dans ${file.name}. Ce document ne pourra pas être utilisé pour un mapping.`,
              variant: "default",
            });
          } else {
            toast({
              title: "Extraction réussie",
              description: `${extractionResult.variables.length} variables détectées dans ${file.name}.`,
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
            title: "Erreur de traitement",
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
  
  // Fonction pour vérifier si les fichiers sont valides pour la génération
  const hasValidFiles = () => {
    return uploadedFiles.some(file => 
      file.status === 'complete' && 
      file.content && 
      file.extractedText && 
      file.extractedText.trim().length > 0
    );
  };

  return {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    resetUploadedFiles,
    hasValidFiles
  };
};
