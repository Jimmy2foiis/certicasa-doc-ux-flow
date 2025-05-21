
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface GeneratorDialogHeaderProps {
  clientName: string;
  onClose: () => void;
  step?: "selection" | "mapping" | "generating" | "success";
  templateName?: string | undefined;
}

const GeneratorDialogHeader = ({ 
  clientName, 
  onClose,
  step,
  templateName 
}: GeneratorDialogHeaderProps) => {
  const getTitle = () => {
    if (step === "mapping" && templateName) {
      return `Configuration du modèle "${templateName}"`;
    } else if (step === "generating") {
      return "Génération en cours...";
    } else if (step === "success") {
      return "Document généré avec succès";
    }
    return `Génération de document pour ${clientName}`;
  };

  return (
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <span>{getTitle()}</span>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </DialogTitle>
      <DialogDescription>
        {step !== "success" && "Sélectionnez un modèle et mappez les variables pour générer un document personnalisé"}
      </DialogDescription>
    </DialogHeader>
  );
};

export default GeneratorDialogHeader;
