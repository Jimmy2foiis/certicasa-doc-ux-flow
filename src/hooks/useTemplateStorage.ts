
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { DocumentTemplate, UploadedFile } from "@/types/documents";

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

  const getTemplates = async (): Promise<DocumentTemplate[]> => {
    // Return mock templates for demo purposes
    return [
      {
        id: "template1",
        name: "Contrat Standard",
        type: "docx",
        dateUploaded: "2025-05-15",
        lastModified: "2025-05-15",
        content: "mock-content",
        userId: "user1",
        size: 250000
      },
      {
        id: "template2",
        name: "Facture Client",
        type: "pdf",
        dateUploaded: "2025-05-10",
        lastModified: "2025-05-12",
        content: "mock-content",
        userId: "user1",
        size: 180000
      }
    ];
  };

  const deleteTemplate = async (templateId: string): Promise<boolean> => {
    toast({
      title: "Modèle supprimé",
      description: "Le modèle a été supprimé avec succès (simulation).",
    });
    return true;
  };
  
  return { saveAllTemplates, getTemplates, deleteTemplate };
};
