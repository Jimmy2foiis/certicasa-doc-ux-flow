
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ClientPersonalSection from "./ClientPersonalSection";
import FileTrackingSection from "./FileTrackingSection";
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
          
          {/* Colonne 2: Suivi administratif */}
          <div>
            <FileTrackingSection 
              status={client.status || "En cours"}
              delegate={client.delegate || "SOLATEC"}
              lotNumber={client.lotNumber || "-"}
              depositDate={client.depositDate}
              documentStats={documentStats}
              onViewMissingDocs={onViewMissingDocs}
            />
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
