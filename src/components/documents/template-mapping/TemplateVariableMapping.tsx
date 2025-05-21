
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { DocumentTemplate } from "@/types/documents";
import { TemplateValidationState } from "@/types/documents";
import { createInitialMapping, loadTemplateMapping, saveTemplateMapping } from "./utils";
import { extractTemplateTags } from "@/utils/docxUtils";
import { NotFoundTemplate } from "./NotFoundTemplate";
import { MappingContent } from "./MappingContent";
import { SaveMappingButton } from "./SaveMappingButton";
import { TemplateVariableMappingProps, TemplateTag } from "./types";

// Composant principal
const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
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
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const formattedTag = newTag.includes("{{") ? newTag : `{{${newTag}}}`;
    
    // Vérifier si la balise existe déjà
    if (templateTags.some(tag => tag.tag === formattedTag)) {
      toast({
        title: "Balise existante",
        description: `La balise ${formattedTag} existe déjà dans la liste.`,
        variant: "default",
      });
      setNewTag("");
      return;
    }
    
    setTemplateTags([
      ...templateTags, 
      { 
        tag: formattedTag, 
        category: activeCategory, 
        mappedTo: `${activeCategory}.${newTag.replace(/[{}]/g, "")}` 
      }
    ]);
    
    setNewTag("");
    
    toast({
      title: "Balise ajoutée",
      description: `La balise ${formattedTag} a été ajoutée à la liste.`,
    });
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
      setLoading(true);
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
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du mapping de template:", error);
      setError("Impossible de sauvegarder le mapping des variables");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le mapping des variables.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };
  
  // Si le template est invalide, afficher un message d'erreur
  if (!template?.id || !template?.content || templateValidationState !== 'unknown') {
    return <NotFoundTemplate reason={templateValidationState} />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Mapping des variables pour "{template.name}"
        </CardTitle>
        <CardDescription>
          Associez chaque balise du document aux données client correspondantes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <MappingContent
          loading={loading}
          error={error}
          templateTags={templateTags}
          clientData={clientData}
          updateCategory={updateCategory}
          updateMapping={updateMapping}
          newTag={newTag}
          setNewTag={setNewTag}
          handleAddTag={handleAddTag}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </CardContent>
      
      <CardFooter>
        <SaveMappingButton
          onClick={handleSaveMapping}
          disabled={loading || saving || !!error || templateTags.length === 0}
          saving={saving}
        />
      </CardFooter>
    </Card>
  );
};

export default TemplateVariableMapping;
