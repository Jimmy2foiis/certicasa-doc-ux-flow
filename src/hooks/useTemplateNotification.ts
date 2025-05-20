
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DOCUMENT_TEMPLATES_KEY } from "@/components/documents/DocumentTemplateUpload";

export const useTemplateNotification = () => {
  const { toast } = useToast();

  // Load existing templates from localStorage on load and show notification
  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem(DOCUMENT_TEMPLATES_KEY);
      if (storedTemplates) {
        const existingTemplates = JSON.parse(storedTemplates);
        if (existingTemplates.length > 0) {
          toast({
            title: "Modèles disponibles",
            description: `${existingTemplates.length} modèle(s) sont disponibles dans votre bibliothèque.`,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement initial des modèles:", error);
    }
  }, [toast]);

  return { toast };
};
