
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { DocumentsHeader } from "./documents/DocumentsHeader";
import { DocumentsFooter } from "./documents/DocumentsFooter";
import { useDocumentsTab } from "@/hooks/documents/useDocumentsTab";
import { DocumentsList } from "./documents/DocumentsList";
import { ErrorDisplay } from "@/components/documents/template-mapping/ErrorDisplay";

interface DocumentsTabContentProps {
  clientId?: string;
  clientName?: string;
  projectType?: string;
}

export const DocumentsTabContent = ({ clientId, clientName, projectType = "RES010" }: DocumentsTabContentProps) => {
  const {
    filteredDocuments,
    searchQuery,
    handleSearchChange,
    handleDocumentAction,
    handleExportAll,
    isLoading,
    updateProjectType,
    isPreviewOpen,
    previewDocument,
    handleClosePreview,
    error
  } = useDocumentsTab(clientId, clientName);

  // Update project type when it changes
  useEffect(() => {
    if (projectType) {
      updateProjectType(projectType);
    }
  }, [projectType, updateProjectType]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <DocumentsHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={() => handleSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)}
          onExportAll={handleExportAll}
          isLoading={isLoading}
          documentCount={filteredDocuments.length}
        />
      </CardHeader>
      
      <CardContent>
        {error && <ErrorDisplay error={error} />}
        
        <DocumentsList 
          documents={filteredDocuments}
          isLoading={isLoading}
          onAction={handleDocumentAction}
        />
      </CardContent>
      
      <CardFooter className="pt-2">
        <DocumentsFooter 
          onExportAll={handleExportAll}
          documentCount={filteredDocuments.length}
          isLoading={isLoading}
        />
      </CardFooter>

      {/* Document preview component */}
      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        document={previewDocument}
        onDownload={(documentId) => handleDocumentAction(documentId, "download")}
      />
    </Card>
  );
};
