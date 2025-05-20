
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DOCUMENT_TEMPLATES_KEY } from '@/components/documents/DocumentTemplateUpload';
import { useToast } from "@/components/ui/use-toast";

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  dateUploaded: string;
  content?: string;
}

export const useDocumentTemplates = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les templates au montage du composant
  useEffect(() => {
    loadTemplates();
  }, []);

  // Charger les modèles depuis Supabase
  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*');
      
      if (error) {
        throw error;
      }

      if (data) {
        // Convertir du format Supabase au format local
        const formattedTemplates: DocumentTemplate[] = data.map(template => ({
          id: template.id,
          name: template.name,
          type: template.type,
          lastModified: new Date(template.last_modified).toLocaleDateString('fr-FR'),
          dateUploaded: new Date(template.date_uploaded).toLocaleDateString('fr-FR'),
          content: template.content
        }));
        setTemplates(formattedTemplates);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
      setTemplates([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger les modèles. Veuillez rafraîchir la page.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Ajouter un nouveau modèle
  const addTemplate = async (template: DocumentTemplate) => {
    try {
      // Convertir au format Supabase
      const supabaseTemplate = {
        name: template.name,
        type: template.type,
        content: template.content,
        last_modified: new Date().toISOString(),
        date_uploaded: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('document_templates')
        .insert([supabaseTemplate])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Ajouter le nouveau modèle avec l'ID généré par Supabase
        const newTemplate = {
          ...template,
          id: data[0].id,
          lastModified: new Date(data[0].last_modified).toLocaleDateString('fr-FR'),
          dateUploaded: new Date(data[0].date_uploaded).toLocaleDateString('fr-FR')
        };
        
        setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
        
        toast({
          title: "Modèle ajouté",
          description: "Le modèle a été ajouté avec succès."
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du modèle:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le modèle. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Supprimer un modèle
  const removeTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        throw error;
      }

      // Mettre à jour l'état local après suppression
      setTemplates(prevTemplates => 
        prevTemplates.filter(template => template.id !== templateId)
      );
      
      toast({
        title: "Modèle supprimé",
        description: "Le modèle a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du modèle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le modèle. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return { templates, loading, addTemplate, removeTemplate, refreshTemplates: loadTemplates };
};
