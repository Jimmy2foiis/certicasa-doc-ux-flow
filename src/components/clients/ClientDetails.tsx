
import React from "react";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/clientTypes";

export interface ClientDetailsProps {
  client?: Client | null;
  clientId?: string;
  onClose?: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onClose }) => {
  if (!client) {
    return <div>Aucun client sélectionné</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Nom</h3>
          <p>{client.name}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p>{client.email || "-"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
          <p>{client.phone || "-"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Type</h3>
          <p>{client.type || "-"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Statut</h3>
          <p>{client.status || "-"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Projets</h3>
          <p>{client.projects || 0}</p>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Fermer</Button>
      </div>
    </div>
  );
};

export default ClientDetails;
