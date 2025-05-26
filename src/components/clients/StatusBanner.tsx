
import React from "react";
import ProjectStatusSection from "./sections/ProjectStatusSection";
import AddressFormSection from "./sections/AddressFormSection";
import TechnicalDataSection from "./sections/TechnicalDataSection";
import TeamBadgesSection from "./sections/TeamBadgesSection";
import { useClimateZoneManagement } from "@/hooks/useClimateZoneManagement";

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
    climateZone?: string;
  } | null;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
  onEditClient?: (e: React.MouseEvent) => void;
  onClimateZoneChange?: (zone: string, confidence?: number, method?: string, referenceCity?: string, distance?: number, description?: string) => void;
}

const StatusBanner = ({
  client,
  documentStats,
  onViewMissingDocs,
  onEditClient,
  onClimateZoneChange
}: StatusBannerProps) => {
  
  // Utiliser le hook centralisé
  const { climateZone, climateData, updateClimateZone, updateZoneOnly } = useClimateZoneManagement({
    initialZone: client?.climateZone,
    onZoneChange: (zone) => {
      if (onClimateZoneChange) {
        onClimateZoneChange(zone);
      }
    }
  });

  const handleClimateZoneChange = (climateInfo: {
    zone: string;
    confidence?: number;
    method?: string;
    referenceCity?: string;
    distance?: number;
    description?: string;
  }) => {
    console.log('🚨 StatusBanner - Zone automatique reçue:', climateInfo.zone);
    updateClimateZone(climateInfo);
  };

  const handleManualClimateZoneChange = (zone: string) => {
    console.log('🚨 StatusBanner - Zone manuelle reçue:', zone);
    updateZoneOnly(zone);
  };

  return (
    <div className="space-y-4">
      {/* Barre d'informations principale */}
      <ProjectStatusSection 
        documentStats={documentStats}
        onViewMissingDocs={onViewMissingDocs}
      />

      {/* Bloc blanc avec les informations détaillées */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        {/* Section Adresse complète */}
        <AddressFormSection 
          client={client} 
          onClimateZoneChange={handleClimateZoneChange}
        />

        {/* Section Données techniques avec Zone Climatique */}
        <TechnicalDataSection
          climateZone={climateZone}
          climateData={climateData}
          onClimateZoneChange={handleManualClimateZoneChange}
        />

        {/* Badges équipe avec icônes */}
        <TeamBadgesSection />
      </div>
    </div>
  );
};

export default StatusBanner;
