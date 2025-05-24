
import { useState, useEffect } from 'react';
import { useAdministrativeDocuments } from '@/hooks/useAdministrativeDocuments';
import type { AdministrativeDocument, DocumentStatus } from '@/types/documents';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { DocumentPreview } from '@/features/documents/DocumentPreview';
import { DocumentsHeader } from './documents/DocumentsHeader';
import { DocumentsFooter } from './documents/DocumentsFooter';
import { DocumentErrorAlert } from './documents/DocumentErrorAlert';
import { DocumentsListContainer } from './documents/DocumentsListContainer';
import { useDocumentActions } from '@/hooks/useDocumentActions';
import { useDocumentExport } from './documents/DocumentExportHandler';

interface DocumentsTabContentProps {
  clientId?: string;
  clientName?: string;
  projectType?: string;
}

export const DocumentsTabContent = ({
  clientId,
  clientName,
  projectType = 'RES010',
}: DocumentsTabContentProps) => {
  const {
    adminDocuments,
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    handleDocumentAction: baseHandleDocumentAction,
    isLoading,
    updateProjectType,
  } = useAdministrativeDocuments(clientId, clientName);

  const [allDocuments, setAllDocuments] = useState<AdministrativeDocument[]>([]);
  const [clientDocuments, setClientDocuments] = useState<AdministrativeDocument[]>([]);

  const {
    handleDocumentAction,
    previewDocument,
    isPreviewOpen,
    error,
    setError,
    handleClosePreview,
  } = useDocumentActions(filteredDocuments, baseHandleDocumentAction);

  const { handleExportAll, handleGenerateAll } = useDocumentExport({
    filteredDocuments,
    onError: setError,
  });

  // Initialize documents when administrative documents are loaded
  useEffect(() => {
    if (clientId && adminDocuments) {
      const transformedDocs = adminDocuments.map((doc) => ({
        ...doc,
        description: (doc as any).description || '',
        order: (doc as any).order || 0,
        id: doc.id,
        name: doc.name,
        type: doc.type,
        status: doc.status as DocumentStatus,
      }));

      const combinedDocs: AdministrativeDocument[] = [
        ...transformedDocs,
        ...clientDocuments.map((doc) => ({
          ...doc,
          description: (doc as any).description || '',
          order: (doc as any).order || 0,
        })),
      ];

      setAllDocuments(combinedDocs);
    }
  }, [clientId, adminDocuments, clientDocuments]);

  // Update project type when it changes
  useEffect(() => {
    if (projectType) {
      updateProjectType(projectType);
    }
  }, [projectType, updateProjectType]);

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle document reordering
  const handleReorderDocuments = (reorderedDocs: AdministrativeDocument[]) => {
    setAllDocuments(reorderedDocs);
    console.log('Documents reordered:', reorderedDocs.map(doc => ({ id: doc.id, name: doc.name })));
  };

  // Handle generating all pending documents
  const handleGenerateAllDocuments = () => {
    const pendingDocs = handleGenerateAll();
    if (pendingDocs) {
      pendingDocs.forEach(doc => {
        handleDocumentAction(doc.id, 'generate');
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <DocumentsHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={() => setSearchQuery('')}
          onExportAll={handleExportAll}
          isLoading={isLoading}
          documentCount={filteredDocuments.length}
        />
      </CardHeader>

      <CardContent>
        <DocumentErrorAlert error={error} />

        <DocumentsListContainer
          documents={filteredDocuments}
          isLoading={isLoading}
          onAction={handleDocumentAction}
          onReorder={handleReorderDocuments}
        />
      </CardContent>

      <CardFooter className="pt-2">
        <DocumentsFooter
          onExportAll={handleExportAll}
          documentCount={filteredDocuments.length}
          isLoading={isLoading}
        />
      </CardFooter>

      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        document={previewDocument}
        onDownload={(documentId) => handleDocumentAction(documentId, 'download')}
      />
    </Card>
  );
};
