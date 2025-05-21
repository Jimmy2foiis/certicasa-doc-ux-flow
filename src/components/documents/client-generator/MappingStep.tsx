
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TemplateVariableMapping from "../template-mapping/TemplateVariableMapping";
import { TemplateTag } from "@/components/documents/template-mapping/types";
import { useState } from "react";

interface MappingStepProps {
  templateTags: TemplateTag[];
  clientId: string;
  onGenerate: (mappings: TemplateTag[]) => void;
  onBack: () => void;
}

const MappingStep = ({
  templateTags,
  clientId,
  onGenerate,
  onBack
}: MappingStepProps) => {
  const [mappings, setMappings] = useState<TemplateTag[]>(templateTags);
  const [canGenerate, setCanGenerate] = useState<boolean>(templateTags.length > 0);

  const handleMappingComplete = (updatedMappings: TemplateTag[]) => {
    setMappings(updatedMappings);
    setCanGenerate(updatedMappings.length > 0);
  };

  return (
    <div className="space-y-4">
      <TemplateVariableMapping
        templateTags={templateTags}
        clientId={clientId}
        onMappingComplete={handleMappingComplete}
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
          onClick={() => onGenerate(mappings)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Générer le document
        </Button>
      </div>
    </div>
  );
};

export default MappingStep;
