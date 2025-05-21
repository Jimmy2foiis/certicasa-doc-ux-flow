
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { TemplateValidationState } from "@/types/documents";
import { NotFoundTemplate } from "./NotFoundTemplate";
import { MappingContent } from "./MappingContent";
import { SaveMappingButton } from "./SaveMappingButton";
import { TemplateVariableMappingProps } from "./types";
import { useTemplateMapping } from "./useTemplateMapping";
import { useMappingActions } from "./useMappingActions";

// Composant principal
const TemplateVariableMapping = ({ template, clientData, onMappingComplete }: TemplateVariableMappingProps) => {
  // Utiliser le hook personnalisé pour gérer l'état du mapping
  const {
    templateTags,
    setTemplateTags,
    loading,
    saving,
    setSaving,
    error,
    newTag,
    setNewTag,
    activeCategory,
    setActiveCategory,
    templateValidationState
  } = useTemplateMapping(template, onMappingComplete);

  // Utiliser le hook personnalisé pour les actions de mapping
  const {
    handleAddTag: handleAddTagAction,
    updateMapping,
    updateCategory,
    handleSaveMapping,
    error: actionError
  } = useMappingActions(
    templateTags,
    setTemplateTags,
    template,
    activeCategory,
    setSaving,
    onMappingComplete
  );

  // Wrapper pour handleAddTag qui réinitialise aussi newTag
  const handleAddTag = () => {
    if (handleAddTagAction(newTag)) {
      setNewTag("");
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
          error={error || actionError}
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
          disabled={loading || saving || !!(error || actionError) || templateTags.length === 0}
          saving={saving}
        />
      </CardFooter>
    </Card>
  );
};

export default TemplateVariableMapping;
