
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DocumentTemplate } from "@/types/documents";
import { FileText, Save } from "lucide-react";
import { AddNewTagField } from "./AddNewTagField";
import { TagsList } from "./TagsList";
import { VariableCategoryTabs } from "./VariableCategoryTabs";
import { TemplateTag, TemplateVariableMappingProps } from "./types";
import { createInitialMapping, loadTemplateMapping, saveTemplateMapping } from "./utils";

// Main component
const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("client");
  const { toast } = useToast();
  
  // Load existing mapping if available
  useEffect(() => {
    const initializeMapping = async () => {
      setLoading(true);
      try {
        // Try to get existing mapping from Supabase
        const mappings = await loadTemplateMapping(template.id);
        
        if (mappings && mappings.length > 0) {
          setTemplateTags(mappings);
          console.log("Loaded existing mapping:", mappings);
        } else {
          // Create initial mapping from template content
          const initialTags = createInitialMapping(template.content);
          setTemplateTags(initialTags);
          console.log("Created initial mapping:", initialTags);
        }
      } catch (error) {
        console.error("Error loading template mapping:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (template?.id) {
      initializeMapping();
    }
  }, [template?.id, template?.content]);
  
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
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le mapping des variables.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
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
        <Button onClick={handleSaveMapping} disabled={loading} className="ml-auto">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder le mapping
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateVariableMapping;
