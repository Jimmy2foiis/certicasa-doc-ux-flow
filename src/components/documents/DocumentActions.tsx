
import { Download, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentActionsProps {
  onDownload: () => void;
}

const DocumentActions = ({ onDownload }: DocumentActionsProps) => {
  return (
    <>
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
