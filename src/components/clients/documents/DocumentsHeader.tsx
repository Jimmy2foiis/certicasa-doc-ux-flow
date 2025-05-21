
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Search, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocumentsHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onExportAll: () => void;
  isLoading: boolean;
  documentCount: number;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onExportAll,
  isLoading,
  documentCount
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Documents du client</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExportAll}
            disabled={isLoading || documentCount === 0}
          >
            <FileDown className="h-4 w-4 mr-1" />
            Exporter tout
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <FileUp className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 my-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un document..."
          className="h-9"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9" 
          onClick={onClearSearch}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
