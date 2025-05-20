
import { useState, useEffect } from 'react';
import { DOCUMENT_TEMPLATES_KEY } from '@/components/documents/DocumentTemplateUpload';
import { useToast } from "@/components/ui/use-toast";

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  dateUploaded: string;
  content?: string; // Contenu du fichier pour l'aperçu
}

export const useDocumentTemplates = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les templates au montage du composant
  useEffect(() => {
    loadTemplates();
    
    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DOCUMENT_TEMPLATES_KEY) {
        loadTemplates();
      }
    };
    
    // Écouter également un événement personnalisé pour les changements dans le même onglet
    const handleCustomStorageEvent = () => {
      loadTemplates();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageEvent);
    };
  }, []);

  // Charger les modèles depuis le localStorage
  const loadTemplates = () => {
    setLoading(true);
    try {
      const storedTemplates = localStorage.getItem(DOCUMENT_TEMPLATES_KEY);
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
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
  const addTemplate = (template: DocumentTemplate) => {
    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
    
    // Déclencher un événement pour mettre à jour d'autres onglets
    window.dispatchEvent(new StorageEvent('storage', {
      key: DOCUMENT_TEMPLATES_KEY
    }));
  };

  // Supprimer un modèle
  const removeTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
    
    // Déclencher un événement pour mettre à jour d'autres onglets
    window.dispatchEvent(new StorageEvent('storage', {
      key: DOCUMENT_TEMPLATES_KEY
    }));
    
    toast({
      title: "Modèle supprimé",
      description: "Le modèle a été supprimé avec succès.",
    });
  };

  return { templates, loading, addTemplate, removeTemplate, refreshTemplates: loadTemplates };
};
