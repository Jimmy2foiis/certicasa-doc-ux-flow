
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";
import { useDocumentGeneration } from "@/hooks/useDocumentGeneration";
import { TemplateTag } from "../template-mapping/types";

interface UseDocumentGeneratorStateProps {
  clientId: string;
  clientName: string;
  onDocumentGenerated: (documentId: string) => void;
}

export const useDocumentGeneratorState = ({
  clientId,
  clientName,
  onDocumentGenerated
}: UseDocumentGeneratorStateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateMappings, setTemplateMappings] = useState<TemplateTag[]>([]);
  
  const { templates, loading } = useDocumentTemplates();
  const { generating, generated, documentId, handleGenerate, handleDownload } = useDocumentGeneration(onDocumentGenerated, clientName);
  const { toast } = useToast();

  // Get the selected template object
  const selectedTemplateObject = templates.find(t => t.id === selectedTemplate);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setSelectedTab("mapping");
  };

  // Handle mapping completion
  const handleMappingComplete = (mappings: TemplateTag[]) => {
    setTemplateMappings(mappings);
    toast({
      title: "Mapping terminé",
      description: "Vous pouvez maintenant procéder à la génération du document."
    });
  };

  // Handle document generation
  const handleDocumentGeneration = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle de document.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate the document with mappings
      await handleGenerate(selectedTemplate, clientId, templateMappings);
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du document.",
        variant: "destructive"
      });
    }
  };

  // Reset the state when dialog is closed
  const handleCloseDialog = () => {
    if (!generating) {
      setIsOpen(false);
      // Wait for dialog animation to finish before resetting state
      setTimeout(() => {
        if (generated) {
          // Don't reset the template selection if successful
          setSelectedTab("templates");
        }
      }, 300);
    }
  };

  return {
    isOpen,
    setIsOpen,
    selectedTab,
    setSelectedTab,
    selectedTemplate,
    selectedTemplateObject,
    templateMappings,
    templates,
    loading,
    generating,
    generated,
    handleTemplateSelect,
    handleMappingComplete,
    handleDocumentGeneration,
    handleCloseDialog,
    handleDownload
  };
};
