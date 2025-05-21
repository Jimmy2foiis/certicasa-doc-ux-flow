
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateVariableMappingProps, TemplateTag, MappingContentProps } from './types';
import { AddNewTagField } from './AddNewTagField';
import { VariableCategoryTabs } from './VariableCategoryTabs';
import { TagsList } from './TagsList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('client');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Extraire les balises du contenu du template au chargement
  useEffect(() => {
    if (template && template.content) {
      setLoading(true);
      setError(null);
      
      try {
        // Simuler l'extraction des balises (remplacer par la logique réelle d'extraction)
        setTimeout(() => {
          const extractedTags: TemplateTag[] = extractTemplateTags(template.content);
          
          if (extractedTags.length === 0) {
            setError("Aucune variable n'a été détectée dans ce modèle. Vous pouvez ajouter des variables manuellement.");
          }
          
          setTemplateTags(extractedTags);
          setLoading(false);
        }, 500);
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
    } else {
      // Aucun contenu à analyser
      setLoading(false);
      setError("Ce modèle n'a pas de contenu valide pour l'extraction des variables");
    }
  }, [template, toast]);

  // Fonction pour extraire les balises du contenu (logique simplifiée)
  const extractTemplateTags = (content: string | null): TemplateTag[] => {
    if (!content) return [];
    
    // Exemple de logique d'extraction - à adapter selon le format réel des templates
    const tagRegex = /\{\{([^}]+)\}\}/g;
    let matches;
    const tags: TemplateTag[] = [];
    
    try {
      const workingContent = content.toString();
      
      // Utiliser exec dans une boucle pour extraire toutes les balises
      while ((matches = tagRegex.exec(workingContent)) !== null) {
        const tag = matches[1].trim();
        // Éviter les doublons
        if (!tags.some(t => t.tag === `{{${tag}}}`)) {
          tags.push({
            tag: `{{${tag}}}`,
            category: 'client', // Catégorie par défaut
            mappedTo: ''
          });
        }
      }
    } catch (e) {
      console.error("Erreur lors de l'analyse du contenu pour extraire les balises:", e);
      setError("Impossible d'analyser le contenu du modèle pour extraire les variables");
    }
    
    return tags;
  };

  // Gérer l'ajout d'une nouvelle balise manuelle
  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast({
        title: "Avertissement",
        description: "Veuillez entrer un nom de variable",
        variant: "default",
      });
      return;
    }
    
    // Formater correctement la nouvelle balise
    const formattedTag = newTag.includes('{{') ? newTag.trim() : `{{${newTag.trim()}}}`;
    
    // Vérifier si la balise existe déjà
    if (templateTags.some(tag => tag.tag.toLowerCase() === formattedTag.toLowerCase())) {
      toast({
        title: "Information",
        description: "Cette variable existe déjà dans la liste",
        variant: "default",
      });
      return;
    }
    
    setTemplateTags([...templateTags, {
      tag: formattedTag,
      category: activeCategory,
      mappedTo: ''
    }]);
    setNewTag('');
    
    toast({
      title: "Variable ajoutée",
      description: `La variable ${formattedTag} a été ajoutée à la liste`,
    });
  };

  // Mettre à jour la valeur mappée pour une balise
  const updateMapping = (index: number, value: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].mappedTo = value;
    setTemplateTags(updatedTags);
  };

  // Mettre à jour la catégorie d'une balise
  const updateCategory = (index: number, category: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].category = category;
    setTemplateTags(updatedTags);
  };

  // Fonction pour terminer et enregistrer le mapping
  const handleSaveMapping = () => {
    setError(null);
    
    // Vérifier si toutes les variables sont mappées
    const unmappedTags = templateTags.filter(tag => !tag.mappedTo || tag.mappedTo.trim() === '');
    
    if (unmappedTags.length > 0) {
      setError(`${unmappedTags.length} variable(s) n'ont pas été mappées. Veuillez associer toutes les variables.`);
      
      toast({
        title: "Association incomplète",
        description: `${unmappedTags.length} variable(s) n'ont pas été associées`,
        variant: "default",
      });
      
      return;
    }
    
    if (templateTags.length === 0) {
      toast({
        title: "Avertissement",
        description: "Aucune variable n'a été définie pour ce modèle",
        variant: "default",
      });
    }
    
    onMappingComplete(templateTags);
    
    toast({
      title: "Association terminée",
      description: `${templateTags.length} variable(s) ont été associées avec succès`,
    });
  };

  // Fonction pour supprimer une balise
  const handleDeleteTag = (index: number) => {
    const updatedTags = [...templateTags];
    updatedTags.splice(index, 1);
    setTemplateTags(updatedTags);
    
    toast({
      title: "Variable supprimée",
      description: "La variable a été supprimée de la liste",
    });
  };

  // Sélectionner une variable pour la balise active
  const handleSelectVariable = (variable: string) => {
    // Si une balise est sélectionnée dans l'UI, on pourrait l'associer à cette variable
    // Sinon, on ajoute simplement la variable au champ de nouvelle balise
    setNewTag(variable);
  };

  // Props communs pour les composants de contenu de mapping
  const mappingContentProps: MappingContentProps = {
    loading,
    templateTags,
    newTag,
    setNewTag,
    handleAddTag,
    activeCategory,
    setActiveCategory,
    updateMapping,
    updateCategory,
    clientData,
    handleDeleteTag
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Association des Variables</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        ) : (
          <>
            <AddNewTagField 
              {...mappingContentProps} 
            />
            
            <div className="mt-6">
              <VariableCategoryTabs 
                {...mappingContentProps}
                onSelectVariable={handleSelectVariable}
              />
              
              <TagsList 
                {...mappingContentProps}
                tags={templateTags}
              />
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {templateTags.length === 0 ? (
                  <span>Aucune variable n'a été définie</span>
                ) : (
                  <span>
                    {templateTags.filter(t => t.mappedTo).length}/{templateTags.length} variables associées
                  </span>
                )}
              </div>
              
              <Button 
                variant="default"
                onClick={handleSaveMapping}
                disabled={templateTags.some(tag => !tag.mappedTo) || templateTags.length === 0}
              >
                Confirmer l'association
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Export default for backward compatibility
export default TemplateVariableMapping;
