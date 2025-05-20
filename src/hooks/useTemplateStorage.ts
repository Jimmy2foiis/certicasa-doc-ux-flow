
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { UploadedFile } from "@/components/documents/TemplateFileItem";

export const useTemplateStorage = (resetUploadedFiles: () => void) => {
  const { toast } = useToast();
  
  // Convertir les fichiers téléversés en modèles de documents et les enregistrer dans Supabase
  const saveAllTemplates = async (uploadedFiles: UploadedFile[]) => {
    try {
      // Filtrer les fichiers complètement téléversés
      const filesToSave = uploadedFiles.filter(file => file.status === 'complete');
      
      if (filesToSave.length === 0) {
        toast({
          title: "Avertissement",
          description: "Aucun fichier valide à enregistrer.",
        });
        return;
      }
      
      // Préparer les données pour Supabase
      const now = new Date().toISOString();
      
      const templates = filesToSave.map(file => ({
        name: file.name.replace(/\.[^/.]+$/, ""), // Enlever l'extension
        type: file.name.split('.').pop() || "unknown",
        content: null, // Le contenu pourrait être ajouté si nécessaire
        last_modified: now,
        date_uploaded: now
      }));
      
      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('document_templates')
        .insert(templates)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Notification de succès
      toast({
        title: "Modèles enregistrés",
        description: `${templates.length} modèle(s) ont été ajoutés à la bibliothèque.`,
      });
      
      // Réinitialiser l'état pour permettre de nouveaux téléversements
      resetUploadedFiles();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modèles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modèles. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return { saveAllTemplates };
};
