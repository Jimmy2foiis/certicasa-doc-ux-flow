
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

export const useTemplateNotification = () => {
  const { toast } = useToast();

  // Charger les modèles existants depuis Supabase et afficher une notification
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Mock data instead of Supabase call
        toast({
          title: "Modèles disponibles",
          description: `Les modèles sont disponibles dans votre bibliothèque.`,
        });
      } catch (error) {
        console.error("Erreur lors du chargement initial des modèles:", error);
      }
    };
    
    fetchTemplates();
  }, [toast]);

  return { toast };
};
