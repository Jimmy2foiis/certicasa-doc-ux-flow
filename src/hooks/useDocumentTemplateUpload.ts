
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DOCUMENT_TEMPLATES_KEY } from "@/components/documents/DocumentTemplateUpload";
import { UploadedFile } from "@/components/documents/TemplateFileItem";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";

export const useDocumentTemplateUpload = () => {
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
        validFiles.push({
          ...file,
          id: `${file.name}-${Date.now()}`,
          progress: 0,
          status: 'uploading'
        });
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

  // Charger les modèles depuis le localStorage
  const loadTemplatesFromStorage = (): DocumentTemplate[] => {
    try {
      const storedTemplates = localStorage.getItem(DOCUMENT_TEMPLATES_KEY);
      if (storedTemplates) {
        return JSON.parse(storedTemplates);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
    }
    return [];
  };
  
  // Enregistrer les modèles dans le localStorage
  const saveTemplateToStorage = (templates: DocumentTemplate[]) => {
    try {
      localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modèles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modèles. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const saveAllTemplates = () => {
    // Convertir les fichiers téléversés en modèles de documents
    const now = new Date().toLocaleDateString('fr-FR');
    
    const newTemplates: DocumentTemplate[] = uploadedFiles
      .filter(file => file.status === 'complete')
      .map(file => ({
        id: file.id,
        name: file.name.replace(/\.[^/.]+$/, ""), // Enlever l'extension
        type: file.name.split('.').pop() || "unknown",
        lastModified: now,
        dateUploaded: now
      }));
    
    // Charger les modèles existants et ajouter les nouveaux
    const existingTemplates = loadTemplatesFromStorage();
    const mergedTemplates = [...existingTemplates, ...newTemplates];
    
    // Sauvegarder dans localStorage
    saveTemplateToStorage(mergedTemplates);
    
    // Notification
    toast({
      title: "Modèles enregistrés",
      description: `${newTemplates.length} modèle(s) ont été ajoutés à la bibliothèque.`,
    });
    
    // Réinitialiser l'état pour permettre de nouveaux téléversements
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
    saveAllTemplates
  };
};
