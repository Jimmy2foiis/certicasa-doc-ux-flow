
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Client } from "@/services/api/types";
import StatusBanner from "./StatusBanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";
import { FileText } from "lucide-react";

interface ClientDetailsHeaderProps {
  client: Client | null;
  clientId: string;
  clientName: string;
  onBack: () => void;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
  onDocumentGenerated?: (documentId: string) => void;
  onClientUpdated?: () => void;
}

const ClientDetailsHeader = ({ 
  client, 
  clientId, 
  clientName, 
  onBack,
  documentStats,
  onViewMissingDocs = () => {},
  onDocumentGenerated = () => {},
  onClientUpdated = () => {}
}: ClientDetailsHeaderProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Handler pour générer un document
  const handleGenerateDocument = () => {
    console.log("Generate document for client:", clientId);
    // Logique pour générer un document
    onDocumentGenerated(`doc-${Date.now()}`); // Pass a dummy document ID for now
  };

  // Handler pour éditer les informations client
  const handleEditClient = (e: React.MouseEvent) => {
    // Prévenir le comportement par défaut et la propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Edit client:", clientId);
    // Ouvrir le dialogue d'édition plutôt que d'utiliser un autre mécanisme qui provoquerait un rechargement
    setShowEditDialog(true);
  };

  // Fermer le dialogue d'édition et notifier les changements
  const handleEditComplete = () => {
    setShowEditDialog(false);
    // Notifier que le client a été mis à jour
    onClientUpdated();
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{clientName}</h1>
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleGenerateDocument}
          >
            <FileText className="h-4 w-4 mr-2" />
            Générer un document
          </Button>
        </div>
        
        {/* Intégration du bandeau de statut */}
        <StatusBanner 
          client={client}
          documentStats={documentStats}
          onViewMissingDocs={onViewMissingDocs}
          onGenerateDocument={handleGenerateDocument}
          onEditClient={handleEditClient}
        />
      </div>

      {/* Dialogue d'édition du client */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier les informations client</DialogTitle>
          </DialogHeader>
          <ClientForm 
            clientId={clientId} 
            initialData={client || undefined}
            onSuccess={handleEditComplete} 
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDetailsHeader;
