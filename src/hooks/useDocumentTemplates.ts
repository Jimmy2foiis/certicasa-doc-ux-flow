import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTemplateStorage } from "./useTemplateStorage";
import type { DocumentTemplate } from "@/types/documents";

export const useDocumentTemplates = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Utiliser un objet vide car nous n'avons pas besoin de resetUploadedFiles ici
  const { getTemplates, deleteTemplate } = useTemplateStorage(() => {});

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTemplates = await getTemplates();
      setTemplates(fetchedTemplates);
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
  }, [getTemplates, toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const refreshTemplates = useCallback(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const removeTemplate = useCallback(async (templateId: string) => {
    const success = await deleteTemplate(templateId);
    if (success) {
      // Mettre à jour l'état local après la suppression
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
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
