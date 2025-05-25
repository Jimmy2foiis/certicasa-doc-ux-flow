import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBanner from "./StatusBanner";

interface ClientDetailsHeaderProps {
  onBack: () => void;
  clientId: string;
  clientName: string;
  client?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    province?: string;
    community?: string;
  };
  onDocumentGenerated?: (documentId: string) => void;
  onClientUpdated?: () => void;
}

const ClientDetailsHeader = ({ 
  onBack, 
  clientId, 
  clientName,
  client,
  onDocumentGenerated,
  onClientUpdated
}: ClientDetailsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 bg-white border rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{clientName}</h1>
          <p className="text-gray-500">ID: {clientId}</p>
        </div>
      </div>
      
      <StatusBanner client={client || undefined} />
    </div>
  );
};

export default ClientDetailsHeader;
