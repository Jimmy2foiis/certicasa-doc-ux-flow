
import React from "react";
import ProjectStatusSection from "./sections/ProjectStatusSection";
import AddressFormSection from "./sections/AddressFormSection";
import TeamBadgesSection from "./sections/TeamBadgesSection";

interface StatusBannerProps {
  client?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    province?: string;
    community?: string;
  } | null;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
  onEditClient?: (e: React.MouseEvent) => void;
}

const StatusBanner = ({
  client,
  documentStats,
  onViewMissingDocs,
  onEditClient
}: StatusBannerProps) => {
  return (
    <div className="space-y-4">
      {/* Barre d'informations principale - maintenant dans la zone grise */}
      <ProjectStatusSection 
        documentStats={documentStats}
        onViewMissingDocs={onViewMissingDocs}
      />

      {/* Bloc blanc avec les informations détaillées */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        {/* Section Adresse complète restructurée */}
        <AddressFormSection client={client} />

        {/* Badges équipe avec icônes */}
        <TeamBadgesSection />
      </div>
    </div>
  );
};

export default StatusBanner;
