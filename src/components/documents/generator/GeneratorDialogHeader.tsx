
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface GeneratorDialogHeaderProps {
  clientName: string;
  onClose: () => void;
}

export function GeneratorDialogHeader({ clientName, onClose }: GeneratorDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <span>Génération de document pour {clientName}</span>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </DialogTitle>
      <DialogDescription>
        Sélectionnez un modèle et mappez les variables pour générer un document personnalisé
      </DialogDescription>
    </DialogHeader>
  );
}
