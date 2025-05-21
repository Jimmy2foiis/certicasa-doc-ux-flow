
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { DocumentTemplate, TemplateTag, TemplateValidationState } from "@/types/documents";
import { availableVariables } from "@/types/documents";
import { createInitialMapping, loadTemplateMapping, saveTemplateMapping } from "./utils";
import { extractTemplateTags } from "@/utils/docxUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

// Composant pour afficher un message quand aucun modèle n'est disponible
const NotFoundTemplate = ({ reason }: { reason: TemplateValidationState }) => {
  const messages = {
    'empty': "Le contenu du modèle est vide",
    'invalid': "Le modèle est invalide ou endommagé",
    'no-tags': "Aucune variable n'a été détectée dans le modèle",
    'unknown': "Une erreur s'est produite lors du chargement du modèle"
  };

  return (
    <div className="p-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">Modèle invalide</h3>
      <p className="text-gray-500 mb-4">{messages[reason]}</p>
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Veuillez vérifier que le modèle contient des variables au format {'{{variable}}'} et réessayer.
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Sous-composant pour le contenu du mapping
const MappingContent = ({
  loading,
  error,
  templateTags,
  updateCategory,
  updateMapping,
  newTag,
  setNewTag,
  handleAddTag,
  activeCategory,
  setActiveCategory
}: {
  loading: boolean;
  error: string | null;
  templateTags: TemplateTag[];
  updateCategory: (index: number, category: string) => void;
  updateMapping: (index: number, value: string) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      {/* Formulaire d'ajout de balise */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nouvelle balise (ex: nom, prénom)"
            className="flex-1"
          />
          <Button onClick={handleAddTag} disabled={!newTag.trim()}>
            Ajouter
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Les balises seront formatées automatiquement comme {`{{balise}}`}
        </p>
      </div>
      
      {/* Liste des balises détectées */}
      <div className="border rounded-md p-4 mb-4">
        <h3 className="font-medium mb-3">
          Balises détectées ({templateTags.length})
        </h3>
        <div className="space-y-3">
          {templateTags.length > 0 ? (
            templateTags.map((tag, index) => (
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
              </div>
            ))
          ) : (
            <div className="border border-dashed rounded-md p-8 text-center">
              <p className="text-gray-500">
                Aucune balise n'a été détectée dans ce modèle de document.
                <br />
                Ajoutez des balises manuellement ou sélectionnez un autre modèle.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Variables disponibles par catégorie */}
      <div>
        <h3 className="font-medium mb-3">Variables disponibles</h3>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-2">
            {Object.keys(availableVariables).map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(availableVariables).map(([category, variables]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {variables.map(variable => (
                    <Badge 
                      key={variable} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-slate-200"
                      onClick={() => setNewTag(variable)}
                    >
                      {`${category}.${variable}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

// Bouton de sauvegarde du mapping
const SaveMappingButton = ({
  onClick,
  disabled,
  saving
}: {
  onClick: () => void;
  disabled: boolean;
  saving: boolean;
}) => (
  <Button 
    onClick={onClick} 
    disabled={disabled}
    className="ml-auto"
  >
    {saving ? (
      <>
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        Sauvegarde en cours...
      </>
    ) : (
      "Sauvegarder le mapping"
    )}
  </Button>
);

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
