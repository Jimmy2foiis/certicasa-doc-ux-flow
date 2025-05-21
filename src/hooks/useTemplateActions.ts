import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DocumentTemplate } from "@/types/documents";

interface UseTemplateActionsReturn {
  previewTemplate: DocumentTemplate | null;
  showPreview: boolean;
  handlePreview: (template: DocumentTemplate) => void;
  closePreview: () => void;
  handleUseTemplate: (template: DocumentTemplate) => void;
}

export const useTemplateActions = (
  setActiveTab: (tab: string) => void
): UseTemplateActionsReturn => {
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handlePreview = (template: DocumentTemplate) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    // Attendre que l'animation du dialogue se termine avant de réinitialiser le template
    setTimeout(() => setPreviewTemplate(null), 300);
  };

  const handleUseTemplate = (template: DocumentTemplate) => {
    // Stocker temporairement le template sélectionné (dans sessionStorage, pas localStorage)
    try {
      sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
      closePreview();
      setActiveTab("generate");
      
      toast({
        title: "Modèle sélectionné",
        description: `"${template.name}" est prêt pour la génération de document.`,
      });
    } catch (error) {
      console.error("Erreur lors de la sélection du template:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sélectionner ce modèle. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return {
    previewTemplate,
    showPreview,
    handlePreview,
    closePreview,
    handleUseTemplate,
  };
};
