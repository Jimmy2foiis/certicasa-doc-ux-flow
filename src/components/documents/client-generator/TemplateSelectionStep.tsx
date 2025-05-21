
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TemplateSelectionList from "../TemplateSelectionList";
import { DocumentTemplate } from "@/types/documents";
import { TemplateTag } from "@/components/documents/template-mapping/types";
import { TemplateValidationState } from "@/types/documents";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";

interface TemplateSelectionStepProps {
  clientId: string;
  onTemplateSelect: (template: DocumentTemplate, tags: TemplateTag[], validState: TemplateValidationState | null) => void;
}

const TemplateSelectionStep = ({
  clientId,
  onTemplateSelect
}: TemplateSelectionStepProps) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const { templates, loading } = useDocumentTemplates();
  
  // Handle selection of a template from the list
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // In a real implementation, we would extract tags and validate here
      // For now, we'll just pass empty arrays and null validation state
      onTemplateSelect(template, [], null);
    }
  };

  return (
    <div className="space-y-4">
      <TemplateSelectionList
        selectedTemplate={selectedTemplateId}
        onTemplateSelect={handleTemplateSelection}
      />
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {loading ? "Chargement des modèles..." : `${templates.length} modèle(s) disponible(s)`}
        </p>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
