
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TemplateTag } from "./types";
import { DocumentTemplate } from "@/types/documents";
import { TemplateValidationState } from "@/types/documents";
import { createInitialMapping, loadTemplateMapping } from "./utils";
import { extractTemplateTags } from "@/utils/docxUtils";

export function useTemplateMapping(
  template: DocumentTemplate | undefined,
  onMappingComplete: (mappings: TemplateTag[]) => void
) {
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("client");
  const [templateValidationState, setTemplateValidationState] = useState<TemplateValidationState>('unknown');
  const { toast } = useToast();

  // Charger le mapping existant si disponible
  useEffect(() => {
    const initializeMapping = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!template?.id) {
          setTemplateValidationState('unknown');
          setError("L'ID du template est manquant");
          return;
        }
        
        if (!template?.content) {
          setTemplateValidationState('empty');
          setError("Le contenu du template est vide ou invalide");
          return;
        }
        
        // Vérifier la présence de variables dans le contenu du template
        const extractedTags = extractTemplateTags(template.content);
        if (extractedTags.length === 0) {
          setTemplateValidationState('no-tags');
          setError("Aucune variable trouvée dans le document");
          toast({
            title: "Aucune variable trouvée",
            description: "Le modèle ne contient pas de variables à associer (format {{variable}}).",
            variant: "default",
          });
          return;
        }
        
        setTemplateValidationState('unknown');
        
        // Essayer d'obtenir le mapping existant depuis Supabase
        const mappings = await loadTemplateMapping(template.id);
        
        if (mappings && mappings.length > 0) {
          setTemplateTags(mappings);
          console.log("Mapping existant chargé:", mappings);
        } else {
          // Créer un mapping initial à partir du contenu du template
          const initialTags = createInitialMapping(template.content);
          setTemplateTags(initialTags);
          console.log("Mapping initial créé:", initialTags);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du mapping de template:", error);
        setTemplateValidationState('invalid');
        setError("Impossible de charger le mapping des variables");
      } finally {
        setLoading(false);
      }
    };
    
    if (template?.id) {
      initializeMapping();
    }
  }, [template?.id, template?.content, toast]);

  return {
    templateTags,
    setTemplateTags,
    loading,
    saving,
    setSaving,
    error,
    newTag,
    setNewTag,
    activeCategory,
    setActiveCategory,
    templateValidationState
  };
}
