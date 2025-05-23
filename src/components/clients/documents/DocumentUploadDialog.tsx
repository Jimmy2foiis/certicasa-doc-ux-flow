
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadDocument: (file: File, documentType: string) => void;
  clientId: string;
}

const DocumentUploadDialog = ({
  open,
  onOpenChange,
  onUploadDocument,
  clientId
}: DocumentUploadDialogProps) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("facture");
  const { toast } = useToast();

  const handleUploadDocument = () => {
    if (!uploadFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    // Call the parent handler
    onUploadDocument(uploadFile, documentType);
    
    // Reset fields
    setUploadFile(null);
    setDocumentType("facture");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleUploadDocument}>
            <Upload className="h-4 w-4 mr-2" />
            Uploader
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
