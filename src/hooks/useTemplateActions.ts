
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DocumentTemplate } from '@/hooks/useDocumentTemplates';

export const useTemplateActions = (setActiveTab?: (tab: string) => void) => {
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Gérer l'aperçu d'un template
  const handlePreview = (template: DocumentTemplate) => {
    setPreviewTemplate(template);
    setShowPreview(true);
    
    toast({
      title: "Aperçu du modèle",
      description: `Visualisation du modèle "${template.name}"`,
    });
  };

  // Fermer l'aperçu
  const closePreview = () => {
    setShowPreview(false);
    setPreviewTemplate(null);
  };

  // Utiliser un template
  const handleUseTemplate = (template: DocumentTemplate) => {
    // Naviguer vers l'onglet de génération si setActiveTab existe
    if (setActiveTab) {
      setActiveTab('generate');
      
      toast({
        title: "Modèle sélectionné",
        description: `Le modèle "${template.name}" a été sélectionné pour la génération de document.`,
      });
      
      // Sauvegarder le modèle sélectionné dans sessionStorage pour le récupérer dans l'onglet de génération
      sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    }
  };

  return {
    previewTemplate,
    showPreview,
    handlePreview,
    closePreview,
    handleUseTemplate
  };
};
