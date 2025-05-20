
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface DocumentsExportFooterProps {
  onExportAll: () => void;
}

const DocumentsExportFooter = ({ onExportAll }: DocumentsExportFooterProps) => {
  return (
    <CardFooter className="flex justify-between items-center pt-6 border-t">
      <div className="text-sm text-muted-foreground">
        Dernière mise à jour: {new Date().toLocaleDateString()}
      </div>
      <Button 
        onClick={onExportAll}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Exporter Dossier Complet
      </Button>
    </CardFooter>
  );
};

export default DocumentsExportFooter;
