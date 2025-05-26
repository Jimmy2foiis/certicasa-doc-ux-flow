
import React, { useEffect } from "react";
import { Settings } from "lucide-react";
import ClimateZoneDisplay from "@/components/clients/ClimateZoneDisplay";

interface TechnicalDataSectionProps {
  climateZone?: string;
  climateData?: {
    confidence?: number;
    method?: string;
    referenceCity?: string;
    distance?: number;
    description?: string;
  };
  onClimateZoneChange?: (zone: string) => void;
}

const TechnicalDataSection = ({
  climateZone,
  climateData,
  onClimateZoneChange
}: TechnicalDataSectionProps) => {
  const handleZoneChange = (zone: string) => {
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span className="text-sm font-medium">Données Techniques</span>
      </div>
      
      <ClimateZoneDisplay
        climateZone={climateZone}
        confidence={climateData?.confidence}
        method={climateData?.method}
        referenceCity={climateData?.referenceCity}
        distance={climateData?.distance}
        description={climateData?.description}
        onZoneChange={handleZoneChange}
        compact={true}
      />
    </div>
  );
};

export default TechnicalDataSection;
