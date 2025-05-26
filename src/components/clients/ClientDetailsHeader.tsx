import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/services/api/types";
import StatusBanner from "./StatusBanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";
import { FileText, Mail, Phone, Save, sync as Sync } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

  // Handler pour enregistrer
  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Enregistrement des données client:", clientId);
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Données sauvegardées avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler pour synchroniser
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      console.log("Synchronisation des données client:", clientId);
      // Simuler une synchronisation
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Synchronisation terminée");
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
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
            {/* Badge Enregistrer */}
            <Badge 
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer px-3 py-1.5 flex items-center gap-2"
              onClick={handleSave}
            >
              <Save className={`h-4 w-4 ${isSaving ? 'animate-pulse' : ''}`} />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Badge>

            {/* Badge Sync */}
            <Badge 
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 cursor-pointer px-3 py-1.5 flex items-center gap-2"
              onClick={handleSync}
            >
              <Sync className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sync...' : 'Sync'}
            </Badge>

            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleGenerateDocument}
            >
              <FileText className="h-4 w-4 mr-2" />
              Générer un document
            </Button>
          </div>
        </div>
        
        {/* Intégration du bandeau de statut */}
        <StatusBanner 
          client={client}
          documentStats={documentStats}
          onViewMissingDocs={onViewMissingDocs}
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
