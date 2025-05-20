
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DOCUMENT_TEMPLATES_KEY } from "@/components/documents/DocumentTemplateUpload";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { UploadedFile } from "@/components/documents/TemplateFileItem";

export const useTemplateStorage = (resetUploadedFiles: () => void) => {
  const { toast } = useToast();

  // Load templates from localStorage
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
  
  // Save templates to localStorage
  const saveTemplateToStorage = (templates: DocumentTemplate[]) => {
    try {
      localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(templates));
      
      // Trigger storage event to update other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: DOCUMENT_TEMPLATES_KEY
      }));
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modèles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modèles. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const saveAllTemplates = (uploadedFiles: UploadedFile[]) => {
    // Convert uploaded files to document templates
    const now = new Date().toLocaleDateString('fr-FR');
    
    const newTemplates: DocumentTemplate[] = uploadedFiles
      .filter(file => file.status === 'complete')
      .map(file => ({
        id: file.id,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        type: file.name.split('.').pop() || "unknown",
        lastModified: now,
        dateUploaded: now
      }));
    
    // Load existing templates and add new ones
    const existingTemplates = loadTemplatesFromStorage();
    const mergedTemplates = [...existingTemplates, ...newTemplates];
    
    // Save to localStorage
    saveTemplateToStorage(mergedTemplates);
    
    // Notification
    toast({
      title: "Modèles enregistrés",
      description: `${newTemplates.length} modèle(s) ont été ajoutés à la bibliothèque.`,
    });
    
    // Reset state to allow new uploads
    resetUploadedFiles();
  };

  return {
    loadTemplatesFromStorage,
    saveTemplateToStorage,
    saveAllTemplates
  };
};
