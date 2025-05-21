
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveMappingButtonProps {
  onClick: () => void;
  disabled: boolean;
  saving: boolean;
}

export const SaveMappingButton = ({ onClick, disabled, saving }: SaveMappingButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled} 
      className="ml-auto"
    >
      {saving ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
          Sauvegarde en cours...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder le mapping
        </>
      )}
    </Button>
  );
};
