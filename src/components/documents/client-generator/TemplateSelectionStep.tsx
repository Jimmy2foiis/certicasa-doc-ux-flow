
import { Button } from "@/components/ui/button";
import TemplateSelectionList from "../TemplateSelectionList";

interface TemplateSelectionStepProps {
  selectedTemplate: string;
  loading: boolean;
  templatesCount: number;
  onTemplateSelect: (templateId: string) => void;
  onContinue: () => void;
}

const TemplateSelectionStep = ({
  selectedTemplate,
  loading,
  templatesCount,
  onTemplateSelect,
  onContinue
}: TemplateSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <TemplateSelectionList
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {loading ? "Chargement des modèles..." : `${templatesCount} modèle(s) disponible(s)`}
        </p>
        <Button
          variant="secondary"
          disabled={!selectedTemplate}
          onClick={onContinue}
        >
          Continuer →
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
