
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClientDocuments } from "@/hooks/documents/useClientDocuments";
import DocumentUploadDialog from './documents/DocumentUploadDialog';
import DocumentsTable from './documents/DocumentsTable';
import EmptyDocumentState from './documents/EmptyDocumentState';
import DocumentLoadingState from './documents/DocumentLoadingState';
import { getStatusColor } from './documents/documentUtils';

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  // Use the client documents hook
  const { 
    adminDocuments: documents,
    isLoading: loading,
    handleDocumentAction
  } = useClientDocuments(clientId);

  // Handle document actions
  const handleDeleteDocument = (documentId: string) => {
    handleDocumentAction(documentId, 'delete');
  };

  // Handle downloading a document
  const handleDownloadDocument = (document: any) => {
    handleDocumentAction(document.id, 'download');
  };

  // Handle sending a document
  const handleSendDocument = (documentId: string) => {
    handleDocumentAction(documentId, 'send');
  };

  // Handle uploading a document
  const handleUploadDocument = (file: File, documentType: string) => {
    toast({
      title: "Upload en cours",
      description: `Upload de ${file.name}...`,
    });

    // Generate a temporary ID for the new document
    const tempId = Math.random().toString(36).substring(2);
    
    // Call handleDocumentAction with 'upload' action and tempId
    handleDocumentAction(tempId, 'upload', {
      file: file,
      name: file.name,
      type: documentType
    });
    
    // Close the dialog
    setShowUploadDialog(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Gestion des documents du client
          </CardDescription>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <DocumentLoadingState />
        ) : documents.length === 0 ? (
          <EmptyDocumentState onAddDocument={() => setShowUploadDialog(true)} />
        ) : (
          <DocumentsTable 
            documents={documents}
            onDownload={handleDownloadDocument}
            onSend={handleSendDocument}
            onDelete={handleDeleteDocument}
            getStatusColor={getStatusColor}
          />
        )}
      </CardContent>

      {/* Dialog for document upload */}
      <DocumentUploadDialog 
        open={showUploadDialog} 
        onOpenChange={setShowUploadDialog}
        onUploadDocument={handleUploadDocument}
        clientId={clientId}
      />
    </Card>
  );
};

export default DocumentsTab;
