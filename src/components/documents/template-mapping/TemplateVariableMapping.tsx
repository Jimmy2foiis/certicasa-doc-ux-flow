
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { FileText, Save, AlertTriangle } from "lucide-react";
import { AddNewTagField } from "./AddNewTagField";
import { TagsList } from "./TagsList";
import { VariableCategoryTabs } from "./VariableCategoryTabs";
import { TemplateTag, TemplateVariableMappingProps, availableVariables } from "./types";
import { createInitialMapping, loadTemplateMapping, saveTemplateMapping } from "./utils";

// Main component
const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("client");
  const { toast } = useToast();
  
  // Load existing mapping if available
  useEffect(() => {
    const initializeMapping = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!template?.id) {
          setError("Template ID is missing");
          return;
        }
        
        if (!template?.content) {
          setError("Template content is empty or invalid");
          return;
        }
        
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
          
          if (initialTags.length === 0 && template.content) {
            toast({
              title: "Aucune variable trouvée",
              description: "Le modèle ne contient pas de variables à associer.",
              variant: "default",
            });
          }
        }
      } catch (error) {
        console.error("Error loading template mapping:", error);
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
  
  if (!template?.id || !template?.content) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-amber-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Modèle invalide
          </CardTitle>
          <CardDescription>
            Le modèle sélectionné est vide ou invalide. Veuillez sélectionner un autre modèle.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Button variant="outline" onClick={() => window.history.back()}>
            Retour à la sélection
          </Button>
        </CardContent>
      </Card>
    );
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
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="border border-red-200 bg-red-50 rounded-md p-4 text-red-800">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            <AddNewTagField 
              newTag={newTag} 
              setNewTag={setNewTag} 
              handleAddTag={handleAddTag} 
            />
            
            <TagsList 
              tags={templateTags}
              clientData={clientData}
              updateCategory={updateCategory}
              updateMapping={updateMapping}
            />
            
            <VariableCategoryTabs 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onSelectVariable={setNewTag}
            />
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSaveMapping} 
          disabled={loading || saving || !!error || templateTags.length === 0} 
          className="ml-auto"
        >
          {saving ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder le mapping
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateVariableMapping;
