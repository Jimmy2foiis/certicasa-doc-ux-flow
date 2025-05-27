import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/services/api/types";
import StatusBanner from "./StatusBanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";
import { FileText, Mail, Phone, RefreshCw, Save } from "lucide-react";
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

  // Handler pour synchroniser
  const handleSync = () => {
    console.log("Sync data for client:", clientId);
    // Logique de synchronisation
  };

  // Handler pour enregistrer
  const handleSave = () => {
    console.log("Save data for client:", clientId);
    // Logique de sauvegarde
  };
  return <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold tracking-tight">{clientName}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{client?.email || "email@example.com"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{client?.phone || "+34 XXX XXX XXX"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors" onClick={handleSync}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync
            </Badge>
            <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
            
          </div>
        </div>
        
        {/* Intégration du bandeau de statut */}
        <StatusBanner client={client} documentStats={documentStats} onViewMissingDocs={onViewMissingDocs} onEditClient={handleEditClient} />
      </div>

      {/* Dialogue d'édition du client */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier les informations client</DialogTitle>
          </DialogHeader>
          <ClientForm clientId={clientId} initialData={client || undefined} onSuccess={handleEditComplete} onCancel={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </>;
};
export default ClientDetailsHeader;