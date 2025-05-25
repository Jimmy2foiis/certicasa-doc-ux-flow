
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/services/api/types";
import { formatDate } from "@/lib/utils";

interface ClientPersonalSectionProps {
  client: Client;
}

const ClientPersonalSection = ({ client }: ClientPersonalSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-base border-b pb-1">Informations du client</h3>
      
      <div className="space-y-2.5">
        {/* Name */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Nom complet</span>
          <span className="font-medium">{client.name || "-"}</span>
        </div>
        
        {/* NIF */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">NIF / NIE</span>
          <span className="font-medium">{client.nif || "X-1234567-Z"}</span>
        </div>
        
        {/* Address */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Adresse complète</span>
          <span className="font-medium">{client.address || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientPersonalSection;
