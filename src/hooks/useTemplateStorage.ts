
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { DocumentTemplate, UploadedFile } from "@/types/documents";
import { useCallback } from "react";

export const useTemplateStorage = (resetUploadedFiles: () => void) => {
  const { toast } = useToast();
  
  // Convertir les fichiers téléversés en modèles de documents et les enregistrer dans Supabase
  const saveAllTemplates = useCallback(async (uploadedFiles: UploadedFile[]) => {
    try {
      // Filtrer les fichiers complètement téléversés
      const filesToSave = uploadedFiles.filter(file => file.status === 'complete');
      
      if (filesToSave.length === 0) {
        toast({
          title: "Avertissement",
          description: "Aucun fichier valide à enregistrer.",
          variant: "default",
        });
        return;
      }
      
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      // Préparer les données pour Supabase
      const now = new Date().toISOString();
      
      const templates = filesToSave.map(file => ({
        name: file.name.replace(/\.[^/.]+$/, ""), // Enlever l'extension
        type: file.name.split('.').pop()?.toLowerCase() || "unknown",
        content: file.content || null,
        last_modified: now,
        date_uploaded: now,
        user_id: user?.id || null // Ajouter l'ID utilisateur si disponible
      }));
      
      console.log("Tentative d'enregistrement des modèles:", templates);
      
      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('document_templates')
        .insert(templates)
        .select();
      
      if (error) {
        console.error("Erreur lors de la sauvegarde des modèles:", error);
        throw error;
      }
      
      console.log("Modèles enregistrés avec succès:", data);
      
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
      
      // Afficher plus de détails dans la console pour le débogage
      if (error instanceof Error) {
        console.error("Détails de l'erreur:", error.message);
      }
    }
  }, [toast, resetUploadedFiles]);

  // Fonction pour récupérer tous les modèles de documents
  const getTemplates = useCallback(async (): Promise<DocumentTemplate[]> => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('date_uploaded', { ascending: false });
        
      if (error) {
        console.error("Erreur lors de la récupération des modèles:", error);
        throw error;
      }
      
      if (!data) {
        return [];
      }
      
      // Transformer les données pour correspondre au format DocumentTemplate
      return data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        dateUploaded: new Date(item.date_uploaded).toLocaleDateString(),
        lastModified: new Date(item.last_modified).toLocaleDateString(),
        content: item.content,
        userId: item.user_id
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des modèles:", error);
      return [];
    }
  }, []);

  // Fonction pour supprimer un modèle de document
  const deleteTemplate = useCallback(async (templateId: string): Promise<boolean> => {
    if (!templateId) {
      console.error("ID de template manquant");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', templateId);
        
      if (error) {
        console.error("Erreur lors de la suppression du modèle:", error);
        throw error;
      }
      
      toast({
        title: "Modèle supprimé",
        description: "Le modèle a été supprimé avec succès."
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du modèle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le modèle. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Fonction pour obtenir un modèle par son ID
  const getTemplateById = useCallback(async (templateId: string): Promise<DocumentTemplate | null> => {
    if (!templateId) {
      console.error("ID de template manquant");
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('id', templateId)
        .maybeSingle();
        
      if (error) {
        console.error("Erreur lors de la récupération du modèle:", error);
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      // Transformer les données pour correspondre au format DocumentTemplate
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        dateUploaded: new Date(data.date_uploaded).toLocaleDateString(),
        lastModified: new Date(data.last_modified).toLocaleDateString(),
        content: data.content,
        userId: data.user_id
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du modèle:", error);
      return null;
    }
  }, []);

  return { 
    saveAllTemplates,
    getTemplates,
    deleteTemplate,
    getTemplateById
  };
};
