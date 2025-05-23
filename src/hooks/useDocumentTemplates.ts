
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTemplateStorage } from "./useTemplateStorage";
import { DocumentTemplate } from "@/types/documents";

export const useDocumentTemplates = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Get the template storage hook functionality
  const { templates: storedTemplates, deleteTemplate } = useTemplateStorage();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      // Use the templates directly from the hook
      setTemplates(storedTemplates);
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les modèles de documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [storedTemplates, toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const refreshTemplates = useCallback(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const removeTemplate = useCallback(async (templateId: string) => {
    deleteTemplate(templateId);
    // Mettre à jour l'état local après la suppression
    setTemplates(prev => prev.filter(template => template.id !== templateId));
    return true;
  }, [deleteTemplate]);

  const forceRefresh = useCallback(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    refreshTemplates,
    removeTemplate,
    forceRefresh
  };
};
