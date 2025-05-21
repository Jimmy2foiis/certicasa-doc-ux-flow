
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface DocumentsHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onExportAll?: () => void;
  isLoading: boolean;
  documentCount: number;
  title?: string;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onExportAll,
  isLoading,
  documentCount,
  title
}) => {
  return (
    <div className="space-y-3">
      {title && (
        <h1 className="text-xl font-bold">{title}</h1>
      )}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={onSearchChange}
            className="pl-9 w-full"
            disabled={isLoading}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={onClearSearch}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Effacer la recherche</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
