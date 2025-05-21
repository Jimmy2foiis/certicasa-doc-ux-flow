
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { extractFileContent } from "@/utils/docxUtils";
import { UploadedFile } from "@/components/documents/TemplateFileItem";

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const id = `${file.name}-${Date.now()}`;
        
        // Créer l'objet de fichier initial
        const uploadedFile: UploadedFile = {
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          progress: 0,
          status: "uploading",
          content: null,
          slice: file.slice,
          stream: file.stream,
          text: file.text,
          arrayBuffer: file.arrayBuffer
        };
        
        // Ajouter le fichier à la liste pour montrer la progression
        setUploadedFiles(prev => [...prev, uploadedFile]);
        newFiles.push(uploadedFile);
        
        // Simuler la progression de l'upload
        await simulateFileUpload(id);
        
        // Extraire le contenu du fichier une fois l'upload terminé
        const content = await extractFileContent(file);
        
        // Loguer les balises trouvées pour le débogage
        const tags = extractTemplateTags(content);
        console.log(`Balises détectées dans ${file.name}:`, tags);
        
        // Mettre à jour le fichier avec le contenu extrait
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === id 
              ? { ...f, status: "complete", progress: 100, content } 
              : f
          )
        );
      }
      
      // Notification de succès
      if (newFiles.length > 0) {
        toast({
          title: "Fichiers téléversés",
          description: `${newFiles.length} fichier(s) téléversés avec succès.`,
        });
      }
    } catch (error) {
      console.error("Erreur lors du téléversement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de téléverser certains fichiers.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Réinitialiser le champ input pour permettre de recharger le même fichier si nécessaire
      event.target.value = "";
    }
  };

  // Fonction pour simuler une progression d'upload
  const simulateFileUpload = async (fileId: string) => {
    let progress = 0;
    const interval = 50; // ms
    
    while (progress < 100) {
      // Incrémenter aléatoirement entre 5% et 15%
      progress += Math.random() * 10 + 5;
      if (progress > 100) progress = 100;
      
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, progress } 
            : file
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, interval));
      
      // Sortir plus tôt si le fichier a été supprimé pendant l'upload
      const fileExists = uploadedFiles.some(file => file.id === fileId);
      if (!fileExists) break;
    }
  };

  // Fonction pour vérifier la présence de balises dans un contenu
  const extractTemplateTags = (content: string | null): string[] => {
    if (!content) return [];
    
    // Match {{tag}} patterns in the content
    const tagRegex = /\{\{([^{}]+)\}\}/g;
    const tags: string[] = [];
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
      tags.push(match[0]);
    }
    
    return [...new Set(tags)]; // Supprimer les doublons
  };

  const confirmDeleteFile = (fileId: string) => {
    setFileToDelete(fileId);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setFileToDelete(null);
    toast({
      title: "Fichier supprimé",
      description: "Le fichier a été retiré de la liste.",
    });
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
