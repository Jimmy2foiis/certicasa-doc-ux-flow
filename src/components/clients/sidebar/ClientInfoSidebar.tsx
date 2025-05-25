
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
    <Card className="h-full shadow-sm">
      <CardContent className="p-4 space-y-5">
        {/* Client personal information */}
        <ClientPersonalSection client={client} />
        <Separator />
        
        {/* Project team information */}
        <ProjectTeamSection 
          teleprospector={client.teleprospector || "Marc Dupont"}
          confirmer={client.confirmer || "Sophie Martin"}
          installationTeam={client.installationTeam || "Équipe A"}
        />
        <Separator />
        
        {/* Administrative file tracking */}
        <FileTrackingSection 
          status={client.status || "En cours"}
          delegate={client.delegate || "SOLATEC"}
          lotNumber={client.lotNumber || "-"}
          depositDate={client.depositDate}
          documentStats={documentStats}
          onViewMissingDocs={onViewMissingDocs}
        />
      </CardContent>
    </Card>
  );
};

export default ClientInfoSidebar;
