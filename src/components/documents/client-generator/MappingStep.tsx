import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import TemplateVariableMapping from "../template-mapping/TemplateVariableMapping";
import { TemplateTag } from "@/components/documents/template-mapping/types";

interface MappingStepProps {
  template: DocumentTemplate;
  clientData: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
  onBack: () => void;
  onGenerate: () => void;
  canGenerate: boolean;
}

const MappingStep = ({
  template,
  clientData,
  onMappingComplete,
  onBack,
  onGenerate,
  canGenerate
}: MappingStepProps) => {
  return (
    <div className="space-y-4">
      <TemplateVariableMapping
        template={template}
        clientData={clientData}
        onMappingComplete={onMappingComplete}
      />
      
      <Separator />
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
        >
          ← Retour
        </Button>
        <Button
          disabled={!canGenerate}
          onClick={onGenerate}
        >
          <FileText className="mr-2 h-4 w-4" />
          Générer le document
        </Button>
      </div>
    </div>
  );
};

export default MappingStep;
