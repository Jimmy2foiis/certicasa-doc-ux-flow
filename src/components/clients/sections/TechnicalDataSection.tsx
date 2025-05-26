
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

  // 🚨 DEBUG TechnicalDataSection
  console.error('🚨 TechnicalDataSection - climateZone REÇUE:', climateZone);
  console.error('🚨 TechnicalDataSection - climateZone type:', typeof climateZone);
  console.error('🚨 TechnicalDataSection - climateZone length:', climateZone?.length);

  const handleZoneChange = (zone: string) => {
    console.error('🚨 TechnicalDataSection - handleZoneChange zone:', zone);
    console.error('🚨 TechnicalDataSection - handleZoneChange type:', typeof zone);
    console.error('🚨 TechnicalDataSection - handleZoneChange length:', zone?.length);
    
    if (onClimateZoneChange) {
      console.error('🚨 TechnicalDataSection - Appel onClimateZoneChange avec:', zone);
      onClimateZoneChange(zone);
    }
  };

  return (
    <div className="border-b pb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Données techniques
      </h3>
      
      {/* Zone Climatique CTE */}
      <div className="mb-3">
        <ClimateZoneDisplay
          climateZone={climateZone}
          confidence={climateData?.confidence}
          method={climateData?.method}
          referenceCity={climateData?.referenceCity}
          distance={climateData?.distance}
          description={climateData?.description}
          onZoneChange={handleZoneChange}
          editable={true}
        />
      </div>
    </div>
  );
};

export default TechnicalDataSection;
