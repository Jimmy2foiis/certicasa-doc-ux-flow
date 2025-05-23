
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
    handleDocumentAction('delete', documentId);
  };

  // Handle downloading a document
  const handleDownloadDocument = (document: any) => {
    handleDocumentAction('download', document.id);
  };

  // Handle sending a document
  const handleSendDocument = (documentId: string) => {
    handleDocumentAction('send', documentId);
  };

  // Handle uploading a document
  const handleUploadDocument = (file: File, documentType: string) => {
    toast({
      title: "Upload en cours",
      description: `Upload de ${file.name}...`,
    });

    // Integration with real document upload
    // Fixed: Passing correct data structure to handleDocumentAction
    handleDocumentAction('upload', {
      id: Math.random().toString(36).substring(2), // Temporary ID for the new document
      name: file.name,
      type: documentType,
      file: file
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
