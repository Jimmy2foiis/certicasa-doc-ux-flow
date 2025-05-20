
import { useState, useEffect } from 'react';
import { DOCUMENT_TEMPLATES_KEY } from '@/components/documents/DocumentTemplateUpload';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  dateUploaded: string;
}

export const useDocumentTemplates = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les templates au montage du composant
  useEffect(() => {
    loadTemplates();
    
    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DOCUMENT_TEMPLATES_KEY) {
        loadTemplates();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
    }
    setLoading(false);
  };

  // Ajouter un nouveau modèle
  const addTemplate = (template: DocumentTemplate) => {
    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
  };

  // Supprimer un modèle
  const removeTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
  };

  return { templates, loading, addTemplate, removeTemplate, refreshTemplates: loadTemplates };
};
