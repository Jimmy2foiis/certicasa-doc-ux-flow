
import { Download, Mail, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentActionsProps {
  onDownload: () => void;
  onView?: () => void;
  showViewButton?: boolean;
}

const DocumentActions = ({ onDownload, onView, showViewButton = false }: DocumentActionsProps) => {
  return (
    <>
      {showViewButton && (
        <Button variant="outline" className="flex-1 sm:flex-none" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          Voir
        </Button>
      )}
      <Button variant="outline" className="flex-1 sm:flex-none" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Télécharger
      </Button>
      <Button variant="outline" className="flex-1 sm:flex-none">
        <Mail className="mr-2 h-4 w-4" />
        Envoyer par email
      </Button>
      <Button variant="outline" className="flex-1 sm:flex-none">
        <Save className="mr-2 h-4 w-4" />
        Enregistrer dans le dossier
      </Button>
    </>
  );
};

export default DocumentActions;
