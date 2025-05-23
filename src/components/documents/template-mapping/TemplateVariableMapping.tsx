
import { Card, CardContent } from "@/components/ui/card";
import { DocumentTemplate } from "@/types/documents";
import { useTemplateVariables } from "./useTemplateVariables";
import { AddNewTagField } from "./AddNewTagField";
import { VariableCategoryTabs } from "./VariableCategoryTabs";
import { TagsList } from "./TagsList";
import { LoadingState } from "./LoadingState";
import { ErrorDisplay } from "./ErrorDisplay";
import { MappingFooter } from "./MappingFooter";

interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: any[]) => void;
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
        
        {error && <ErrorDisplay error={error} />}
        
        {loading ? (
          <LoadingState />
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
            
            <MappingFooter
              templateTags={templateTags}
              handleSaveMapping={handleSaveMapping}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Export default for backward compatibility
export default TemplateVariableMapping;
