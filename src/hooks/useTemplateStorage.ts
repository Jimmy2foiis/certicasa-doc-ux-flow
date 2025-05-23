import { useState } from "react";
import { DocumentTemplate } from "@/types/documents";

// Mock implementation of template storage functions
export const useTemplateStorage = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch a template by ID
  const getTemplate = (templateId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate fetching from a database or API
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        setError("Template not found");
        return null;
      }
      
      return template;
    } catch (err) {
      setError("Failed to fetch template");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a template
  const deleteTemplate = (templateId: string) => {
    setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== templateId));
  };

  // Function to save a template
  const saveTemplate = (template: Partial<DocumentTemplate>) => {
    // Simulate saving to a database or API
    console.log("Saving template:", template);
    
    // Create a complete template object with all required fields
    const newTemplate: DocumentTemplate = {
      id: template.id || `template_${Date.now()}`,
      name: template.name || "Template sans nom",
      type: template.type || "unknown",
      content: template.content || "",
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: template.updatedAt || new Date().toISOString(),
      dateUploaded: template.dateUploaded || new Date().toISOString(),
      lastModified: template.lastModified || new Date().toISOString(),
      userId: template.userId || "current_user",
      size: template.size || 0,
      description: template.description
    };
    
    // Update the state with the new template
    setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
    
    return newTemplate;
  };
  
  // Function to update an existing template
  const updateTemplate = (templateId: string, data: Partial<DocumentTemplate>) => {
    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === templateId 
          ? {
              ...template,
              ...data,
              updatedAt: new Date().toISOString() // Always update the updatedAt timestamp
            } 
          : template
      )
    );
  };

  return {
    templates,
    saveTemplate,
    getTemplate,
    updateTemplate,
    deleteTemplate,
    isLoading,
    error
  };
};

export default useTemplateStorage;
