
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface DocumentsExportFooterProps {
  onExportAll: () => void;
}

const DocumentsExportFooter = ({ onExportAll }: DocumentsExportFooterProps) => {
  return (
    <CardFooter className="pt-0 mt-4 border-t flex justify-end">
      <Button 
        variant="outline" 
        onClick={onExportAll}
        className="mt-4"
      >
        <Download className="h-4 w-4 mr-2" />
        Exporter tous les documents
      </Button>
    </CardFooter>
  );
};

export default DocumentsExportFooter;
