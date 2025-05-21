
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateVariableMappingProps, TemplateTag, MappingContentProps } from './types';
import { AddNewTagField } from './AddNewTagField';
import { VariableCategoryTabs } from './VariableCategoryTabs';
import { TagsList } from './TagsList';

export const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('client');

  // Extraire les balises du contenu du template au chargement
  useEffect(() => {
    if (template && template.content) {
      setLoading(true);
      try {
        // Simuler l'extraction des balises (remplacer par la logique réelle d'extraction)
        setTimeout(() => {
          const extractedTags: TemplateTag[] = extractTemplateTags(template.content);
          setTemplateTags(extractedTags);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erreur lors de l\'extraction des balises:', error);
        setLoading(false);
      }
    } else {
      // Aucun contenu à analyser
      setLoading(false);
    }
  }, [template]);

  // Fonction pour extraire les balises du contenu (logique simplifiée)
  const extractTemplateTags = (content: string | null): TemplateTag[] => {
    if (!content) return [];
    
    // Exemple de logique d'extraction - à adapter selon le format réel des templates
    const tagRegex = /\{\{([^}]+)\}\}/g;
    const matches = content.matchAll(tagRegex);
    const tags: TemplateTag[] = [];
    
    for (const match of matches) {
      const tag = match[1].trim();
      // Éviter les doublons
      if (!tags.some(t => t.tag === tag)) {
        tags.push({
          tag,
          category: 'client', // Catégorie par défaut
          mappedTo: ''
        });
      }
    }
    
    return tags;
  };

  // Gérer l'ajout d'une nouvelle balise manuelle
  const handleAddTag = () => {
    if (newTag.trim() && !templateTags.some(tag => tag.tag === newTag.trim())) {
      setTemplateTags([...templateTags, {
        tag: newTag.trim(),
        category: activeCategory,
        mappedTo: ''
      }]);
      setNewTag('');
    }
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
    onMappingComplete(templateTags);
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
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Association des Variables</h2>
        
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
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="default"
                onClick={handleSaveMapping}
                disabled={templateTags.some(tag => !tag.mappedTo)}
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
