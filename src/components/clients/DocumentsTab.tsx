import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getDocumentsForClient, deleteDocument, markDocumentAsSent } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("facture");
  const { toast } = useToast();

  // Charger les documents du client
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getDocumentsForClient(clientId);
        if (Array.isArray(docs)) {
          setDocuments(docs);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents du client",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [clientId, toast]);

  // Gérer la suppression d'un document
  const handleDeleteDocument = async (documentId: string) => {
    try {
      const success = await deleteDocument(documentId);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        toast({
          title: "Document supprimé",
          description: "Le document a été supprimé avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  // Gérer le téléchargement d'un document
  const handleDownloadDocument = (document: any) => {
    // Logique de téléchargement
    console.log("Téléchargement du document:", document);
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document.name} en cours...`,
    });
    
    // Simuler un téléchargement (à remplacer par la vraie logique)
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: `${document.name} a été téléchargé avec succès`,
      });
    }, 1500);
  };

  // Gérer l'envoi d'un document
  const handleSendDocument = async (documentId: string) => {
    try {
      const success = await markDocumentAsSent(documentId);
      if (success) {
        // Mettre à jour le statut du document dans la liste
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId ? { ...doc, status: "Envoyé" } : doc
        ));
        
        toast({
          title: "Document envoyé",
          description: "Le document a été marqué comme envoyé",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de marquer le document comme envoyé",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi",
        variant: "destructive",
      });
    }
  };

  // Gérer l'upload d'un document
  const handleUploadDocument = () => {
    if (!uploadFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    // Simuler l'upload (à remplacer par la vraie logique)
    toast({
      title: "Upload en cours",
      description: `Upload de ${uploadFile.name}...`,
    });

    // Simuler un délai d'upload
    setTimeout(() => {
      // Ajouter le document à la liste
      const newDocument = {
        id: `doc-${Date.now()}`,
        name: uploadFile.name,
        type: documentType,
        status: "Nouveau",
        created_at: new Date().toISOString(),
        client_id: clientId,
      };

      setDocuments(prev => [...prev, newDocument]);
      
      // Fermer le dialogue et réinitialiser les champs
      setShowUploadDialog(false);
      setUploadFile(null);
      setDocumentType("facture");
      
      toast({
        title: "Document uploadé",
        description: `${uploadFile.name} a été uploadé avec succès`,
      });
    }, 1500);
  };

  // Obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "envoyé":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "en attente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "erreur":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "nouveau":
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
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status || "Nouveau"}
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
                      {doc.status !== "Envoyé" && (
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
