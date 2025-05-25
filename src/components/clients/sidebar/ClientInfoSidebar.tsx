
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClientPersonalSection from "./ClientPersonalSection";
import ProjectTeamSection from "./ProjectTeamSection";
import { Client } from "@/services/api/types";

interface ClientInfoSidebarProps {
  client: Client | null;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
}

const ClientInfoSidebar = ({ client, documentStats, onViewMissingDocs }: ClientInfoSidebarProps) => {
  if (!client) return null;

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-3">
        <div className="grid grid-cols-4 gap-6">
          {/* Colonne 1: Informations personnelles */}
          <div>
            <ClientPersonalSection client={client} />
          </div>
          
          {/* Colonne 2: Informations techniques */}
          <div>
            <div className="space-y-3">
              <h3 className="font-semibold text-base border-b pb-1">Informations techniques</h3>
              
              <div className="space-y-2.5">
                {/* Surface isolée */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Surface isolée</span>
                  <span className="font-medium">{client.isolatedArea ? `${client.isolatedArea} m²` : "70 m²"}</span>
                </div>
                
                {/* Type d'isolation */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Type d'isolation</span>
                  <span className="font-medium">{client.isolationType || "Combles"}</span>
                </div>
                
                {/* Type de plancher */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Type de plancher</span>
                  <span className="font-medium">{client.floorType || "Bois"}</span>
                </div>
                
                {/* Zone climatique */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Zone climatique</span>
                  <Badge variant="outline" className="mt-1 w-fit bg-gray-50">
                    {client.climateZone || "C"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Colonne 3: Vide pour l'instant */}
          <div>
            {/* Espace réservé pour futur contenu */}
          </div>
          
          {/* Colonne 4: Équipe projet */}
          <div>
            <ProjectTeamSection 
              teleprospector={client.teleprospector || "Marc Dupont"}
              confirmer={client.confirmer || "Sophie Martin"}
              installationTeam={client.installationTeam || "Équipe A"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSidebar;
