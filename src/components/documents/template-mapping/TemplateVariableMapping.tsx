
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { TemplateTag, TemplateVariableMappingProps, availableVariables } from "./types";
import { createInitialMapping, loadTemplateMapping, saveTemplateMapping, extractTemplateTags } from "./utils";
import { NotFoundTemplate } from "./NotFoundTemplate";
import { MappingContent } from "./MappingContent";
import { SaveMappingButton } from "./SaveMappingButton";

// Main component
const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("client");
  const [templateValidationState, setTemplateValidationState] = useState<'valid' | 'empty' | 'invalid' | 'no-tags' | 'unknown'>('unknown');
  const { toast } = useToast();
  
  // Load existing mapping if available
  useEffect(() => {
    const initializeMapping = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!template?.id) {
          setTemplateValidationState('unknown');
          setError("Template ID is missing");
          return;
        }
        
        if (!template?.content) {
          setTemplateValidationState('empty');
          setError("Template content is empty or invalid");
          return;
        }
        
        // Check for variables in the template content
        const extractedTags = extractTemplateTags(template.content);
        if (extractedTags.length === 0) {
          setTemplateValidationState('no-tags');
          setError("No template variables found in document");
          toast({
            title: "Aucune variable trouvée",
            description: "Le modèle ne contient pas de variables à associer (format {{variable}}).",
            variant: "warning",
          });
          return;
        }
        
        setTemplateValidationState('valid');
        
        // Try to get existing mapping from Supabase
        const mappings = await loadTemplateMapping(template.id, availableVariables);
        
        if (mappings && mappings.length > 0) {
          setTemplateTags(mappings);
          console.log("Loaded existing mapping:", mappings);
        } else {
          // Create initial mapping from template content
          const initialTags = createInitialMapping(template.content, availableVariables);
          setTemplateTags(initialTags);
          console.log("Created initial mapping:", initialTags);
        }
      } catch (error) {
        console.error("Error loading template mapping:", error);
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
        throw new Error("Template ID is missing");
      }
      
      console.log("Saving mapping for template:", template.id, templateTags);
      
      // Save mapping to Supabase
      const success = await saveTemplateMapping(template.id, templateTags);
      
      if (!success) throw new Error("Failed to save mapping");
      
      toast({
        title: "Mapping sauvegardé",
        description: "Les correspondances de variables ont été sauvegardées.",
      });
      
      // Notify parent component
      onMappingComplete(templateTags);
      
    } catch (error) {
      console.error("Error saving template mapping:", error);
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
  
  if (!template?.id || !template?.content || templateValidationState !== 'valid') {
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
