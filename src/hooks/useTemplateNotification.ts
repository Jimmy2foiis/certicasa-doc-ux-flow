
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const useTemplateNotification = () => {
  const { toast } = useToast();

  // Charger les modèles existants depuis Supabase et afficher une notification
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('document_templates')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          toast({
            title: "Modèles disponibles",
            description: `${data.length} modèle(s) sont disponibles dans votre bibliothèque.`,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial des modèles:", error);
      }
    };
    
    fetchTemplates();
  }, [toast]);

  return { toast };
};
