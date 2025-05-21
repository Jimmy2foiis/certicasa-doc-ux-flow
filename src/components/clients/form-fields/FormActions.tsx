
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitText?: string;
}

export const FormActions = ({ onCancel, isSubmitting, submitText = 'Créer le client' }: FormActionsProps) => {
  return (
    <DialogFooter className="pt-4">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création...
          </>
        ) : (
          submitText
        )}
      </Button>
    </DialogFooter>
  );
};
