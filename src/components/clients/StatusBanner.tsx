
import React from "react";
import ProjectStatusSection from "./sections/ProjectStatusSection";
import AddressFormSection from "./sections/AddressFormSection";
import TeamBadgesSection from "./sections/TeamBadgesSection";
import { useSimpleClimateZone } from "@/hooks/useSimpleClimateZone";

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
  
  const { climateZone, climateData, updateClimateZone, setZoneOnly } = useSimpleClimateZone({
    initialZone: client?.climateZone || "C3",
    onZoneChange: (zone) => {
      console.log('🚨 StatusBanner - Propagation zone vers parent:', zone);
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
    console.log('🚨 StatusBanner - Zone automatique reçue:', climateInfo);
    updateClimateZone(climateInfo);
    
    // Propager immédiatement la nouvelle zone vers les composants enfants
    if (onClimateZoneChange) {
      onClimateZoneChange(
        climateInfo.zone,
        climateInfo.confidence,
        climateInfo.method,
        climateInfo.referenceCity,
        climateInfo.distance,
        climateInfo.description
      );
    }
  };

  const handleManualClimateZoneChange = (zone: string) => {
    console.log('🚨 StatusBanner - Zone manuelle reçue:', zone);
    setZoneOnly(zone);
    
    // Propager immédiatement la zone manuelle vers les composants enfants
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  return (
    <div className="space-y-4">
      <ProjectStatusSection 
        documentStats={documentStats}
        onViewMissingDocs={onViewMissingDocs}
      />

      <div className="bg-white border rounded-lg p-4 space-y-4">
        <AddressFormSection 
          client={client} 
          onClimateZoneChange={handleClimateZoneChange}
        />

        <TeamBadgesSection />
      </div>
    </div>
  );
};

export default StatusBanner;
