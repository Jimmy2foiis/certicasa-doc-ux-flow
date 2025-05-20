
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface DocumentsExportFooterProps {
  onExportAll: () => void;
}

const DocumentsExportFooter = ({ onExportAll }: DocumentsExportFooterProps) => {
  return (
    <CardFooter className="flex justify-end">
      <Button 
        variant="outline" 
        className="flex items-center" 
        onClick={onExportAll}
      >
        <Download className="mr-2 h-4 w-4" />
        Exporter Dossier Complet (ZIP)
      </Button>
    </CardFooter>
  );
};

export default DocumentsExportFooter;
