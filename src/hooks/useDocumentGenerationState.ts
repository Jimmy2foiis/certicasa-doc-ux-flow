
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentGeneration, TemplateTag } from "@/hooks/useDocumentGeneration";
import { DocumentTemplate } from "@/types/documents";

interface UseDocumentGenerationStateProps {
  clientId: string;
  clientName: string;
  onDocumentGenerated: (documentId: string) => void;
}

export function useDocumentGenerationState({
  clientId,
  clientName,
  onDocumentGenerated
}: UseDocumentGenerationStateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateMappings, setTemplateMappings] = useState<TemplateTag[]>([]);
  const [templateValid, setTemplateValid] = useState<boolean>(false);
  const { generating, generated, documentId, handleGenerate, handleDownload, error, canDownload, reset } = useDocumentGeneration(onDocumentGenerated, clientName);
  const { toast } = useToast();

  // Vérifier si le template est valide
  const validateTemplate = useCallback((template: DocumentTemplate | undefined) => {
    if (!template) {
      return false;
    }
    
    // Vérifier que le template a un contenu non vide
    if (!template.content || template.content.trim() === "") {
      return false;
    }
    
    // Si c'est un PDF, vérifier le format
    if (template.type === 'pdf') {
      return template.content.startsWith('data:application/pdf') || template.content.startsWith('blob:');
    }
    
    return true;
  }, []);

  // Handle template selection
  const handleTemplateSelect = useCallback((templateId: string, templates: DocumentTemplate[]) => {
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      toast({
        title: "Erreur",
        description: "Modèle introuvable",
        variant: "destructive"
      });
      return;
    }
    
    // Valider le template sélectionné
    const isValid = validateTemplate(template);
    setTemplateValid(isValid);
    
    if (!isValid) {
      toast({
        title: "Avertissement",
        description: "Le modèle sélectionné est vide ou contient un contenu invalide. La génération de document pourrait échouer.",
        variant: "default"
      });
    }
    
    setSelectedTemplate(templateId);
    setSelectedTab("mapping");
  }, [validateTemplate, toast]);

  // Handle mapping completion
  const handleMappingComplete = useCallback((mappings: TemplateTag[]) => {
    setTemplateMappings(mappings);
    
    // Vérifier si toutes les variables sont mappées
    const unmappedCount = mappings.filter(m => !m.mappedTo || m.mappedTo === "").length;
    
    if (unmappedCount > 0) {
      toast({
        title: "Avertissement",
        description: `${unmappedCount} variables n'ont pas été mappées. La génération pourrait ne pas être optimale.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Mapping terminé",
        description: `${mappings.length} variables ont été mappées. Vous pouvez maintenant générer le document.`,
      });
    }
  }, [toast]);

  // Vérifier si le mapping est valide
  const validateMapping = useCallback((): {valid: boolean, message: string} => {
    if (!templateMappings || templateMappings.length === 0) {
      return {
        valid: false,
        message: "Aucune variable n'a été définie pour ce modèle"
      };
    }
    
    const unmappedTags = templateMappings.filter(tag => !tag.mappedTo || tag.mappedTo.trim() === '');
    
    if (unmappedTags.length > 0) {
      return {
        valid: false,
        message: `${unmappedTags.length} variable(s) n'ont pas été mappées`
      };
    }
    
    return { valid: true, message: "" };
  }, [templateMappings]);

  // Handle document generation
  const handleDocumentGeneration = useCallback(async () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle de document.",
        variant: "destructive"
      });
      return;
    }
    
    if (!templateValid) {
      toast({
        title: "Erreur",
        description: "Le modèle sélectionné est invalide ou vide. Impossible de générer un document.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Valider le mapping
      const validationResult = validateMapping();
      
      if (!validationResult.valid) {
        toast({
          title: "Erreur de mapping",
          description: validationResult.message,
          variant: "destructive"
        });
        return;
      }

      // Generate the document with mappings
      await handleGenerate(selectedTemplate, clientId, templateMappings);
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la génération du document: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    }
  }, [selectedTemplate, templateValid, validateMapping, toast, handleGenerate, clientId, templateMappings]);

  // Reset the state when dialog is closed
  const handleCloseDialog = useCallback(() => {
    if (!generating) {
      setIsOpen(false);
      // Wait for dialog animation to finish before resetting state
      setTimeout(() => {
        if (!generated) {
          setSelectedTab("templates");
          setSelectedTemplate("");
          setTemplateMappings([]);
        }
        reset(); // Reset the document generation state
      }, 300);
    }
  }, [generating, generated, reset]);

  // Open dialog and refresh templates
  const handleOpenDialog = useCallback(() => {
    setIsOpen(true);
    reset(); // Reset any previous generation state
  }, [reset]);

  return {
    isOpen,
    setIsOpen,
    selectedTab,
    setSelectedTab,
    selectedTemplate,
    templateMappings,
    templateValid,
    generating,
    generated,
    documentId,
    error,
    canDownload,
    handleTemplateSelect,
    handleMappingComplete,
    handleDocumentGeneration,
    handleDownload,
    handleCloseDialog,
    handleOpenDialog,
  };
}
