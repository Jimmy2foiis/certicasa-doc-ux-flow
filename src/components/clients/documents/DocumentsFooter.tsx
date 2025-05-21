
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface DocumentsFooterProps {
  onExportAll: () => void;
  documentCount: number;
  isLoading: boolean;
}

export const DocumentsFooter: React.FC<DocumentsFooterProps> = ({
  onExportAll,
  documentCount,
  isLoading
}) => {
  return (
    <div className="flex justify-end w-full">
      <Button 
        variant="default" 
        size="sm" 
        onClick={onExportAll}
        disabled={isLoading || documentCount === 0}
        className="flex items-center"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Tout télécharger
      </Button>
    </div>
  );
};
