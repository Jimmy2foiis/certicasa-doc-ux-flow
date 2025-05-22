
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

// Create a mock implementation for the hook
export const useTemplateStorage = (resetUploadedFiles: () => void) => {
  const { toast } = useToast();
  
  const saveAllTemplates = async (files: any[]) => {
    toast({
      title: "Fonctionnalité non disponible",
      description: "Le stockage de modèles nécessite une intégration Supabase.",
      variant: "destructive",
    });
    return [];
  };
  
  return { saveAllTemplates };
};
