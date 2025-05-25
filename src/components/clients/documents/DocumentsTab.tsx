
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useClientDocuments } from "@/hooks/documents/useClientDocuments";
import { useDocumentMapping } from "@/hooks/documents/useDocumentMapping";
import { useDocumentUpload } from "@/hooks/documents/useDocumentUpload";
import DocumentUploadDialog from './DocumentUploadDialog';
import DocumentsTabHeader from './DocumentsTabHeader';
import DocumentsTabContent from './DocumentsTabContent';

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Use the client documents hook - now with refreshDocuments function
  const { 
    adminDocuments: documents,
    isLoading: loading,
    handleDocumentAction,
    refreshDocuments
  } = useClientDocuments(clientId);

  // Use the document mapping hook
  const { requiredDocuments } = useDocumentMapping(documents);

  // Use the document upload hook
  const { handleUploadDocument } = useDocumentUpload(handleDocumentAction);

  // Handle document actions
  const handleDocAction = (documentId: string, action: string) => {
    handleDocumentAction(documentId, action);
  };

  // Handle uploading a document with dialog close
  const handleUploadDocumentWithClose = (file: File, documentType: string) => {
    handleUploadDocument(file, documentType);
    setShowUploadDialog(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <DocumentsTabHeader onShowUploadDialog={() => setShowUploadDialog(true)} />
        
        <DocumentsTabContent 
          requiredDocuments={requiredDocuments}
          isLoading={loading}
          onAction={handleDocAction}
          onRefresh={refreshDocuments}
        />

        {/* Dialog for document upload */}
        <DocumentUploadDialog 
          open={showUploadDialog} 
          onOpenChange={setShowUploadDialog}
          onUploadDocument={handleUploadDocumentWithClose}
          clientId={clientId}
        />
      </Card>
    </div>
  );
};

export default DocumentsTab;
