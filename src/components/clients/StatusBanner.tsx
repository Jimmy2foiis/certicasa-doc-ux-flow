
import React, { useState } from "react";
import ProjectStatusSection from "./sections/ProjectStatusSection";
import AddressFormSection from "./sections/AddressFormSection";
import TechnicalDataSection from "./sections/TechnicalDataSection";
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
  const [climateZone, setClimateZone] = useState(client?.climateZone || "");
  const [climateData, setClimateData] = useState<{
    confidence?: number;
    method?: string;
    referenceCity?: string;
    distance?: number;
    description?: string;
  }>({});

  const handleClimateZoneChange = (climateInfo: {
    zone: string;
    confidence?: number;
    method?: string;
    referenceCity?: string;
    distance?: number;
    description?: string;
  }) => {
    console.error('🚨 StatusBanner - RÉCEPTION zone automatique:', climateInfo.zone);
    console.error('🚨 StatusBanner - Données complètes:', climateInfo);
    
    setClimateZone(climateInfo.zone);
    console.error('🚨 StatusBanner - STOCKAGE zone dans state:', climateInfo.zone);
    
    setClimateData({
      confidence: climateInfo.confidence,
      method: climateInfo.method,
      referenceCity: climateInfo.referenceCity,
      distance: climateInfo.distance,
      description: climateInfo.description
    });

    // Propager le changement vers le parent (pour synchroniser avec ThermalEconomySection)
    if (onClimateZoneChange) {
      console.error('🚨 StatusBanner - TRANSMISSION vers parent:', climateInfo.zone);
      onClimateZoneChange(
        climateInfo.zone,
        climateInfo.confidence,
        climateInfo.method,
        climateInfo.referenceCity,
        climateInfo.distance,
        climateInfo.description
      );
    } else {
      console.error('🚨 StatusBanner - ERREUR: onClimateZoneChange est undefined !');
    }
  };

  const handleManualClimateZoneChange = (zone: string) => {
    console.error('🚨 StatusBanner - RÉCEPTION zone manuelle:', zone);
    setClimateZone(zone);
    console.error('🚨 StatusBanner - STOCKAGE zone manuelle dans state:', zone);
    
    // Réinitialiser les données automatiques quand on change manuellement
    setClimateData({});

    // Propager le changement vers le parent
    if (onClimateZoneChange) {
      console.error('🚨 StatusBanner - TRANSMISSION zone manuelle vers parent:', zone);
      onClimateZoneChange(zone);
    } else {
      console.error('🚨 StatusBanner - ERREUR: onClimateZoneChange est undefined pour zone manuelle !');
    }
  };

  return (
    <div className="space-y-4">
      {/* Barre d'informations principale - maintenant dans la zone grise */}
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
