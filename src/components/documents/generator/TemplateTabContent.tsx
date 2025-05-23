
import { DocumentTemplate } from "@/types/documents";
import { Button } from "@/components/ui/button";
import TemplateSelectionList from "../TemplateSelectionList";

interface TemplateTabContentProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onContinue: () => void;
  templates: DocumentTemplate[];
  loading: boolean;
  templateValid: boolean;
}

export function TemplateTabContent({
  selectedTemplate,
  onTemplateSelect,
  onContinue,
  templates,
  loading,
  templateValid
}: TemplateTabContentProps) {
  return (
    <div className="space-y-4">
      <TemplateSelectionList
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {loading ? "Chargement des modèles..." : `${templates.length} modèle(s) disponible(s)`}
        </p>
        <Button
          variant="secondary"
          disabled={!selectedTemplate || !templateValid}
          onClick={onContinue}
        >
          Continuer →
        </Button>
      </div>
    </div>
  );
}
