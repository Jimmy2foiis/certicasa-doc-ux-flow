
import React from "react";
import { Client } from "@/services/api/types";

interface ClientPersonalSectionProps {
  client: Client;
}

const ClientPersonalSection = ({ client }: ClientPersonalSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-base border-b pb-1">Informations du client</h3>
      
      <div className="space-y-2.5">
        {/* Nom complet */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Nom complet</span>
          <span className="font-medium">{client.name || "-"}</span>
        </div>
        
        {/* Adresse complète */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Adresse complète</span>
          <span className="font-medium">{client.address || "-"}</span>
        </div>
        
        {/* Téléphone */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Téléphone</span>
          <span className="font-medium">{client.phone || "-"}</span>
        </div>
        
        {/* Mail */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Mail</span>
          <span className="font-medium">{client.email || "-"}</span>
        </div>
        
        {/* NIF/NIE */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">NIF / NIE</span>
          <span className="font-medium">{client.nif || "X-1234567-Z"}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientPersonalSection;
