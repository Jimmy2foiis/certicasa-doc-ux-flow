
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
          
          {/* Colonne 2: Vide */}
          <div>
            {/* Colonne vidée comme demandé */}
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
