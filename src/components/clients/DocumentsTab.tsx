
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Trash2, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useClientDocuments } from "@/hooks/documents/useClientDocuments";

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("facture");
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
  const handleUploadDocument = () => {
    if (!uploadFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Upload en cours",
      description: `Upload de ${uploadFile.name}...`,
    });

    // Integration with real document upload
    const uploadData = {
      file: uploadFile,
      type: documentType,
      name: uploadFile.name,
      clientId
    };
    
    // Fix: handleDocumentAction expects action and data
    handleDocumentAction('upload', uploadData);
    
    // Close the dialog and reset fields
    setShowUploadDialog(false);
    setUploadFile(null);
    setDocumentType("facture");
  };

  // Obtain the color for status badges
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "sent":
      case "available":
      case "signed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
      case "missing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "error":
      case "action-required":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "generated":
      case "ready":
      case "linked":
      case "draft":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
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
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Chargement des documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <FileText className="h-10 w-10 text-gray-400" />
            <p className="text-gray-500">Aucun document disponible pour ce client</p>
            <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
              Ajouter un premier document
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    {new Date(doc.created_at || Date.now()).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status || "available"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadDocument(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {doc.status !== "sent" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendDocument(doc.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog pour l'upload de document */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Type de document</Label>
              <select
                id="documentType"
                className="w-full p-2 border rounded-md"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="facture">Facture</option>
                <option value="devis">Devis</option>
                <option value="contrat">Contrat</option>
                <option value="attestation">Attestation</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleUploadDocument}>
              <Upload className="h-4 w-4 mr-2" />
              Uploader
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentsTab;
