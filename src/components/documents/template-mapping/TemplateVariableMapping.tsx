
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DocumentTemplate, TemplateTag } from "@/types/documents";
import { useTemplateVariables } from "./useTemplateVariables";
import { AddNewTagField } from "./AddNewTagField";
import { VariableCategoryTabs } from "./VariableCategoryTabs";
import { TagsList } from "./TagsList";

interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

export const TemplateVariableMapping = ({ 
  template, 
  clientData, 
  onMappingComplete 
}: TemplateVariableMappingProps) => {
  const {
    loading,
    templateTags,
    newTag,
    setNewTag,
    activeCategory,
    setActiveCategory,
    error,
    handleAddTag,
    updateMapping,
    updateCategory,
    handleSaveMapping,
    handleDeleteTag
  } = useTemplateVariables(template, onMappingComplete);

  // Handle selecting a variable for the active tag
  const handleSelectVariable = (variable: string) => {
    setNewTag(variable);
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
              newTag={newTag}
              setNewTag={setNewTag}
              handleAddTag={handleAddTag}
            />
            
            <div className="mt-6">
              <VariableCategoryTabs 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onSelectVariable={handleSelectVariable}
              />
              
              <TagsList 
                tags={templateTags}
                clientData={clientData}
                updateMapping={updateMapping}
                updateCategory={updateCategory}
                handleDeleteTag={handleDeleteTag}
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
                disabled={templateTags.length === 0}
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
