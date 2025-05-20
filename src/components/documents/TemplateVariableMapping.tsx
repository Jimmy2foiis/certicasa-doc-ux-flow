
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { Save, FileText, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type TemplateTag = { 
  tag: string;
  category: string;
  mappedTo: string;
};

export interface TagMapping {
  templateId: string;
  mappings: TemplateTag[];
}

interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

// Object containing all available variables by category
const availableVariables = {
  client: ["name", "email", "phone", "address", "nif", "type", "status"],
  project: ["name", "type", "surface_area", "roof_area", "status", "created_at"],
  cadastre: ["utm_coordinates", "cadastral_reference", "climate_zone", "api_source"],
  calcul: ["type", "improvement", "surface", "date", "calculation_data"],
  document: ["name", "type", "status", "created_at"]
};

// Helper function to extract tags from a document content
const extractTemplateTags = (content: string | null): string[] => {
  if (!content) return [];
  
  // Match {{tag}} patterns in the content
  const tagRegex = /\{\{([^{}]+)\}\}/g;
  const tags: string[] = [];
  let match;
  
  while ((match = tagRegex.exec(content)) !== null) {
    tags.push(match[0]);
  }
  
  return [...new Set(tags)]; // Remove duplicates
};

// Helper function to determine the most likely category for a tag
const determineTagCategory = (tag: string): string => {
  // Remove {{ and }} and split by dot if present
  const cleanTag = tag.replace(/[{}]/g, "");
  const parts = cleanTag.split(".");
  
  if (parts.length > 1) {
    const category = parts[0].toLowerCase();
    if (Object.keys(availableVariables).includes(category)) {
      return category;
    }
  }
  
  // Attempt to match with known variable names
  for (const [category, variables] of Object.entries(availableVariables)) {
    if (variables.some(v => cleanTag.includes(v))) {
      return category;
    }
  }
  
  // Default to client if no match
  return "client";
};

// Helper to get a suitable default mapping for a tag
const getDefaultMapping = (tag: string): string => {
  const cleanTag = tag.replace(/[{}]/g, "");
  const parts = cleanTag.split(".");
  
  if (parts.length > 1) {
    return cleanTag; // Already has category.variable format
  }
  
  // Try to find in available variables
  for (const [category, variables] of Object.entries(availableVariables)) {
    for (const variable of variables) {
      if (cleanTag === variable || cleanTag.includes(variable)) {
        return `${category}.${variable}`;
      }
    }
  }
  
  // If no match found, use the tag name with the default category
  const category = determineTagCategory(tag);
  return `${category}.${cleanTag}`;
};

const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("client");
  const { toast } = useToast();
  
  // Load existing mapping if available
  useEffect(() => {
    const loadExistingMapping = async () => {
      setLoading(true);
      try {
        // Try to get existing mapping from Supabase
        const { data: mappingData, error } = await supabase
          .from('template_mappings')
          .select('mappings')
          .eq('template_id', template.id)
          .single();
        
        if (error) {
          // If not found, create initial mapping from template content
          const extractedTags = extractTemplateTags(template.content);
          const initialTags: TemplateTag[] = extractedTags.map(tag => ({
            tag,
            category: determineTagCategory(tag),
            mappedTo: getDefaultMapping(tag)
          }));
          
          setTemplateTags(initialTags);
          console.log("Created initial mapping:", initialTags);
        } else if (mappingData) {
          // Use existing mapping
          setTemplateTags(mappingData.mappings);
          console.log("Loaded existing mapping:", mappingData.mappings);
        }
      } catch (error) {
        console.error("Error loading template mapping:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (template?.id) {
      loadExistingMapping();
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
  
  const saveMapping = async () => {
    try {
      setLoading(true);
      
      // Save mapping to Supabase
      const { error } = await supabase
        .from('template_mappings')
        .upsert({
          template_id: template.id,
          mappings: templateTags,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
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
  
  const updateCategory = (index: number, category: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].category = category;
    setTemplateTags(updatedTags);
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
            <div className="space-y-2">
              <Label>Ajouter une nouvelle balise</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Exemple: nom, prénom, adresse..." 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button onClick={handleAddTag}>
                  <Tag className="mr-2 h-4 w-4" /> Ajouter
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Les balises seront formatées comme {`{{balise}}`}
              </p>
            </div>
            
            {templateTags.length > 0 ? (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">Balises détectées ({templateTags.length})</h3>
                <div className="space-y-3">
                  {templateTags.map((tag, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <Badge variant="outline" className="justify-center w-full overflow-hidden text-ellipsis">
                          {tag.tag}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <span className="text-gray-400">→</span>
                      </div>
                      <div className="col-span-3">
                        <Select 
                          value={tag.category} 
                          onValueChange={(value) => updateCategory(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(availableVariables).map(category => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <Select 
                          value={tag.mappedTo.split('.')[1] || ''} 
                          onValueChange={(value) => updateMapping(index, `${tag.category}.${value}`)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Variable" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableVariables[tag.category as keyof typeof availableVariables]?.map(variable => (
                              <SelectItem key={variable} value={variable}>
                                {variable}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        {clientData && clientData[tag.category]?.[tag.mappedTo.split('.')[1]] ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            ✓
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            ?
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center">
                <p className="text-gray-500">
                  Aucune balise n'a été détectée dans ce modèle de document.
                  <br />
                  Ajoutez des balises manuellement ou sélectionnez un autre modèle.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button onClick={saveMapping} disabled={loading} className="ml-auto">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder le mapping
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateVariableMapping;
