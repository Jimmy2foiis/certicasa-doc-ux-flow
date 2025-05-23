
import React from "react";
import { AdministrativeDocument } from "@/types/documents";
import { LoadingState } from "@/components/documents/template-mapping/LoadingState";
import DocumentsAccordion from "@/components/documents/DocumentsAccordion";

interface DocumentsListProps {
  documents: AdministrativeDocument[];
  isLoading: boolean;
  onAction: (documentId: string, action: string) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading,
  onAction
}) => {
  if (isLoading) {
    return <DocumentsLoadingState />;
  }

  if (documents.length === 0) {
    return <DocumentsEmptyState />;
  }

  return (
    <DocumentsAccordion 
      documents={documents}
      onDocumentAction={onAction}
    />
  );
};

const DocumentsLoadingState = () => (
  <div className="space-y-3">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
          <div>
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 mt-2 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
      </div>
    ))}
  </div>
);

const DocumentsEmptyState = () => (
  <div className="text-center py-8">
    <p className="text-muted-foreground">Aucun document trouvé</p>
  </div>
);
