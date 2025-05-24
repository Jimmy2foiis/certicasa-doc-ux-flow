
import type { AdministrativeDocument } from '@/types/documents';
import DocumentsTableWithDragDrop from '@/features/documents/DocumentsTableWithDragDrop';
import { DocumentsLoadingState } from './DocumentsLoadingState';

interface DocumentsListContainerProps {
  documents: AdministrativeDocument[];
  isLoading: boolean;
  onAction: (documentId: string, action: string) => void;
  onReorder: (reorderedDocs: AdministrativeDocument[]) => void;
}

export const DocumentsListContainer = ({
  documents,
  isLoading,
  onAction,
  onReorder,
}: DocumentsListContainerProps) => {
  if (isLoading) {
    return <DocumentsLoadingState />;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun document trouvé</p>
      </div>
    );
  }

  return (
    <DocumentsTableWithDragDrop
      documents={documents}
      onDocumentAction={onAction}
      onReorderDocuments={onReorder}
    />
  );
};
