
import React from "react";
import { Button } from "@/components/ui/button";
import { Client } from "@/services/api/types";
import StatusBanner from "./StatusBanner";

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
}

const ClientDetailsHeader = ({ 
  client, 
  clientId, 
  clientName, 
  onBack,
  documentStats,
  onViewMissingDocs = () => {}
}: ClientDetailsHeaderProps) => {
  // Handler pour générer un document
  const handleGenerateDocument = () => {
    console.log("Generate document for client:", clientId);
    // Logique pour générer un document
  };

  // Handler pour éditer les informations client
  const handleEditClient = () => {
    console.log("Edit client:", clientId);
    // Logique pour éditer le client
  };

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{clientName}</h1>
      
      {/* Intégration du nouveau bandeau de statut */}
      <StatusBanner 
        client={client}
        documentStats={documentStats}
        onViewMissingDocs={onViewMissingDocs}
        onGenerateDocument={handleGenerateDocument}
        onEditClient={handleEditClient}
      />
    </div>
  );
};

export default ClientDetailsHeader;
