
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TemplateTag } from "./types";
import { saveTemplateMapping } from "./utils";
import { DocumentTemplate } from "@/types/documents";

export function useMappingActions(
  templateTags: TemplateTag[],
  setTemplateTags: React.Dispatch<React.SetStateAction<TemplateTag[]>>,
  template: DocumentTemplate | undefined,
  activeCategory: string,
  setSaving: React.Dispatch<React.SetStateAction<boolean>>,
  onMappingComplete: (mappings: TemplateTag[]) => void
) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = (newTag: string) => {
    if (!newTag.trim()) return;
    
    const formattedTag = newTag.includes("{{") ? newTag : `{{${newTag}}}`;
    
    // Vérifier si la balise existe déjà
    if (templateTags.some(tag => tag.tag === formattedTag)) {
      toast({
        title: "Balise existante",
        description: `La balise ${formattedTag} existe déjà dans la liste.`,
        variant: "default",
      });
      return false;
    }
    
    setTemplateTags([
      ...templateTags, 
      { 
        tag: formattedTag, 
        category: activeCategory, 
        mappedTo: `${activeCategory}.${newTag.replace(/[{}]/g, "")}` 
      }
    ]);
    
    toast({
      title: "Balise ajoutée",
      description: `La balise ${formattedTag} a été ajoutée à la liste.`,
    });
    
    return true;
  };
  
  const updateMapping = (index: number, value: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].mappedTo = value;
    setTemplateTags(updatedTags);
  };
  
  const updateCategory = (index: number, category: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].category = category;
    setTemplateTags(updatedTags);
  };
  
  const handleSaveMapping = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (!template?.id) {
        throw new Error("L'ID du template est manquant");
      }
      
      console.log("Sauvegarde du mapping pour le template:", template.id, templateTags);
      
      // Sauvegarder le mapping dans Supabase
      const success = await saveTemplateMapping(template.id, templateTags);
      
      if (!success) throw new Error("Échec de la sauvegarde du mapping");
      
      toast({
        title: "Mapping sauvegardé",
        description: "Les correspondances de variables ont été sauvegardées.",
      });
      
      // Notifier le composant parent
      onMappingComplete(templateTags);
      return true;
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du mapping de template:", error);
      setError("Impossible de sauvegarder le mapping des variables");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le mapping des variables.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    handleAddTag,
    updateMapping,
    updateCategory,
    handleSaveMapping,
    error
  };
}
