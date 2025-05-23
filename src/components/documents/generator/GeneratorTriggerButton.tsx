
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface GeneratorTriggerButtonProps {
  onClick: () => void;
}

export function GeneratorTriggerButton({ onClick }: GeneratorTriggerButtonProps) {
  return (
    <Button onClick={onClick}>
      <FileText className="mr-2 h-5 w-5" />
      Générer un document
    </Button>
  );
}
