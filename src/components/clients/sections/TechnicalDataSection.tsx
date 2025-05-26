
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
    <div className="border-b pb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Données techniques
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <ClimateZoneDisplay
            climateZone={climateZone}
            confidence={climateData?.confidence}
            method={climateData?.method}
            referenceCity={climateData?.referenceCity}
            distance={climateData?.distance}
            description={climateData?.description}
            onZoneChange={handleZoneChange}
            editable={true}
            compact={true}
          />
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default TechnicalDataSection;
