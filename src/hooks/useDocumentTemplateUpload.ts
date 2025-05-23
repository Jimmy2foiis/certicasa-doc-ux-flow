import { useFileUpload } from "./useFileUpload";
import { useTemplateStorage } from "./useTemplateStorage";
import { useToast } from "@/hooks/use-toast";
import type { UploadedFile } from "@/types/documents";
import { useState } from "react";

export const useDocumentTemplateUpload = () => {
  const {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    resetUploadedFiles,
    hasValidFiles
  } = useFileUpload();

  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const showNotification = (title: string, description: string, variant?: "default" | "destructive") => {
    toast({
      title,
      description,
      variant
    });
  };

  const { saveAllTemplates } = useTemplateStorage(resetUploadedFiles);
  
  const handleSaveTemplates = async () => {
    try {
      setError(null);
      
      if (uploadedFiles.length === 0) {
        setError("Aucun fichier à enregistrer. Veuillez d'abord téléverser des modèles.");
        toast({
          title: "Avertissement",
          description: "Aucun fichier à enregistrer",
          variant: "default",
        });
        return;
      }
      
      // Vérifier si tous les fichiers sont complètement téléversés
      const incompleteFiles = uploadedFiles.filter(file => 
        file.status !== 'complete' || !file.content
      );
      
      if (incompleteFiles.length > 0) {
        setError(`${incompleteFiles.length} fichier(s) n'ont pas été correctement téléversés. Veuillez réessayer.`);
        toast({
          title: "Erreur",
          description: "Certains fichiers ne sont pas prêts à être enregistrés",
          variant: "destructive",
        });
        return;
      }
      
      // Vérifier si le texte a été extrait pour chaque fichier
      const filesWithoutText = uploadedFiles.filter(file =>
        !file.extractedText || file.extractedText.trim().length === 0
      );
      
      if (filesWithoutText.length > 0) {
        const fileNames = filesWithoutText.map(f => f.name).join(', ');
        setError(`Impossible d'extraire du texte de: ${fileNames}. Ces modèles ne pourront pas être utilisés pour le mapping de variables.`);
        toast({
          title: "Erreur",
          description: "Certains fichiers ne contiennent pas de texte extractible",
          variant: "destructive",
        });
        return;
      }
      
      // Enregistrer les modèles
      await saveAllTemplates(uploadedFiles as UploadedFile[]);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des modèles:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement des modèles");
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les modèles",
        variant: "destructive",
      });
    }
  };

  return {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    saveAllTemplates: handleSaveTemplates,
    showNotification,
    error,
    setError,
    hasValidFiles
  };
};
