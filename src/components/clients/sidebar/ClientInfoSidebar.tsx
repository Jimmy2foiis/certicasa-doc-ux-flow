
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ClientPersonalSection from "./ClientPersonalSection";
import ProjectTeamSection from "./ProjectTeamSection";
import FileTrackingSection from "./FileTrackingSection";
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
          teleprospector={client.teleprospector || "-"}
          confirmer={client.confirmer || "-"}
          installationTeam={client.installationTeam || "-"}
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
