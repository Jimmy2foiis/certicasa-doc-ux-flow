
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
        
        {/* Climate Zone & Fiche Type */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Zone climatique</span>
            <Badge variant="outline" className="mt-1 w-fit">
              {client.climateZone || "C"}
            </Badge>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">Type de fiche</span>
            <Badge variant="secondary" className="mt-1">
              {client.ficheType || "RES020"}
            </Badge>
          </div>
        </div>
        
        {/* Isolated Area */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Surface isolée</span>
          <span className="font-medium">{client.isolatedArea ? `${client.isolatedArea} m²` : "- m²"}</span>
        </div>
        
        {/* Isolation Type */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Type d'isolation</span>
          <span className="font-medium">{client.isolationType || "Combles"}</span>
        </div>
        
        {/* Floor Type */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Type de plancher</span>
          <span className="font-medium">{client.floorType || "Bois"}</span>
        </div>
        
        {/* Entry Channel */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Canal d'entrée</span>
          <span className="font-medium">{client.entryChannel || "Web"}</span>
        </div>
        
        {/* Registration Date */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Date d'inscription</span>
          <span className="font-medium">{client.created_at ? formatDate(new Date(client.created_at), "dd/MM/yyyy") : "-"}</span>
        </div>
        
        {/* Installation Date */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Date de la pose</span>
          <span className="font-medium">{client.installationDate || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientPersonalSection;
