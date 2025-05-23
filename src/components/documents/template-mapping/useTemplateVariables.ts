
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TemplateTag, DocumentTemplate } from "@/types/documents";

export const useTemplateVariables = (
  template: DocumentTemplate,
  onMappingComplete: (mappings: TemplateTag[]) => void
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('client');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Extract tags from template content on load
  useEffect(() => {
    if (!template) {
      setError("Aucun template fourni");
      setLoading(false);
      return;
    }
    
    if (!template.content) {
      setError("Le template n'a pas de contenu");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Extract tags from content
      const extractedTags = extractTemplateTags(template.content);
      
      if (extractedTags.length === 0) {
        setError("Aucune variable n'a été détectée dans ce modèle. Vous pouvez ajouter des variables manuellement.");
      }
      
      setTemplateTags(extractedTags);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de l\'extraction des balises:', error);
      setError(error instanceof Error ? error.message : "Erreur lors de l'extraction des variables");
      setLoading(false);
      
      toast({
        title: "Erreur",
        description: "Impossible d'extraire les variables du modèle",
        variant: "destructive",
      });
    }
  }, [template, toast]);

  // Function to extract tags from content (simplified logic)
  const extractTemplateTags = (content: string | null): TemplateTag[] => {
    if (!content) return [];
    
    // Example tag extraction - adapt based on actual template format
    const tagRegex = /\{\{([^}]+)\}\}/g;
    let matches;
    const tags: TemplateTag[] = [];
    
    try {
      const workingContent = content.toString();
      
      // Use exec in a loop to extract all tags
      while ((matches = tagRegex.exec(workingContent)) !== null) {
        const tagText = matches[0].trim(); // Full tag with {{}}
        const tagInside = matches[1].trim(); // Content inside {{}}
        
        // Avoid duplicates
        if (!tags.some(t => t.tag === tagText)) {
          // Determine category based on tag content
          let category = 'client'; // Default category
          
          if (tagInside.toLowerCase().includes('projet') || tagInside.toLowerCase().includes('project')) {
            category = 'project';
          } else if (tagInside.toLowerCase().includes('calcul')) {
            category = 'calcul';
          } else if (tagInside.toLowerCase().includes('cadastre')) {
            category = 'cadastre';
          }
          
          tags.push({
            id: `tag-${tags.length + 1}`, // Generate unique id
            name: tagInside,
            value: "",
            tag: tagText,
            category: category,
            mappedTo: ''
          });
        }
      }
      
      return tags;
    } catch (e) {
      console.error("Erreur lors de l'analyse du contenu pour extraire les balises:", e);
      setError("Impossible d'analyser le contenu du modèle pour extraire les variables");
      return [];
    }
  };

  // Handle adding a new tag manually
  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast({
        title: "Avertissement",
        description: "Veuillez entrer un nom de variable",
        variant: "default",
      });
      return;
    }
    
    // Format the new tag correctly
    const formattedTag = newTag.includes('{{') ? newTag.trim() : `{{${newTag.trim()}}}`;
    
    // Check if tag already exists
    if (templateTags.some(tag => tag.tag?.toLowerCase() === formattedTag.toLowerCase())) {
      toast({
        title: "Information",
        description: "Cette variable existe déjà dans la liste",
        variant: "default",
      });
      return;
    }
    
    // Add new tag with required properties for TemplateTag type
    const newTemplateTag: TemplateTag = {
      id: `tag-${Date.now()}`,
      name: newTag.trim(),
      value: "",
      tag: formattedTag,
      category: activeCategory,
      mappedTo: ''
    };
    
    setTemplateTags([...templateTags, newTemplateTag]);
    setNewTag('');
    
    toast({
      title: "Variable ajoutée",
      description: `La variable ${formattedTag} a été ajoutée à la liste`,
    });
  };

  // Update the mapped value for a tag
  const updateMapping = (index: number, value: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].mappedTo = value;
    setTemplateTags(updatedTags);
  };

  // Update the category for a tag
  const updateCategory = (index: number, category: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].category = category;
    setTemplateTags(updatedTags);
  };

  // Validate mapping is complete and valid
  const validateMapping = (): {valid: boolean, message: string} => {
    if (templateTags.length === 0) {
      return {
        valid: false, 
        message: "Aucune variable n'a été définie pour ce modèle"
      };
    }
    
    const unmappedTags = templateTags.filter(tag => !tag.mappedTo || tag.mappedTo.trim() === '');
    
    if (unmappedTags.length > 0) {
      return {
        valid: false,
        message: `${unmappedTags.length} variable(s) n'ont pas été mappées`
      };
    }
    
    // Check for invalid mappings
    const invalidMappings = templateTags.filter(tag => {
      return tag.mappedTo === "undefined.undefined" || !tag.mappedTo?.includes(".");
    });
    
    if (invalidMappings.length > 0) {
      return {
        valid: false,
        message: `${invalidMappings.length} variable(s) ont un mapping invalide`
      };
    }
    
    return { valid: true, message: "" };
  };

  // Handle saving the mapping
  const handleSaveMapping = () => {
    setError(null);
    
    // Validate mapping
    const validationResult = validateMapping();
    
    if (!validationResult.valid) {
      setError(`${validationResult.message}. Veuillez associer toutes les variables correctement.`);
      
      toast({
        title: "Association incomplète",
        description: validationResult.message,
        variant: "default",
      });
      
      return;
    }
    
    onMappingComplete(templateTags);
    
    toast({
      title: "Association terminée",
      description: `${templateTags.length} variable(s) ont été associées avec succès`,
    });
  };

  // Function to delete a tag
  const handleDeleteTag = (index: number) => {
    const updatedTags = [...templateTags];
    updatedTags.splice(index, 1);
    setTemplateTags(updatedTags);
    
    toast({
      title: "Variable supprimée",
      description: "La variable a été supprimée de la liste",
    });
  };

  return {
    loading,
    templateTags,
    newTag,
    setNewTag,
    activeCategory,
    setActiveCategory,
    error,
    handleAddTag,
    updateMapping,
    updateCategory,
    handleSaveMapping,
    handleDeleteTag,
    validateMapping
  };
};
