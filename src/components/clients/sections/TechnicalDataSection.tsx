
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
  
  // 🐛 DEBUG: Tracer la zone climatique dans TechnicalDataSection
  console.log('⚙️ TechnicalDataSection - zone climatique reçue:', climateZone);
  console.log('⚙️ TechnicalDataSection - climateData:', climateData);
  
  // 🛠️ EFFET pour surveiller les changements
  useEffect(() => {
    console.log('🔄 TechnicalDataSection - Effet déclenché, zone:', climateZone);
  }, [climateZone]);

  return (
    <div className="border-b pb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Données techniques
        {/* 🐛 DEBUG: Afficher la zone dans le titre */}
        <span className="text-xs text-blue-600">({climateZone})</span>
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
          onZoneChange={onClimateZoneChange}
          editable={true}
        />
      </div>
    </div>
  );
};

export default TechnicalDataSection;
