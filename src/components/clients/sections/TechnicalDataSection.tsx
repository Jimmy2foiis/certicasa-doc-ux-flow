
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
  
  // 🚨 DEBUG URGENT: Tracer toutes les props reçues
  console.log('⚙️ TechnicalDataSection - PROPS COMPLÈTES REÇUES:', {
    climateZone,
    climateData,
    onClimateZoneChange: !!onClimateZoneChange
  });
  
  // 🚨 DEBUG: Surveiller les changements
  useEffect(() => {
    console.log('🔄 TechnicalDataSection - EFFET déclenché:', {
      climateZone,
      climateDataMethod: climateData?.method,
      climateDataReferenceCity: climateData?.referenceCity,
      climateDataConfidence: climateData?.confidence
    });
  }, [climateZone, climateData]);

  // 🚨 DEBUG: Handler de changement
  const handleZoneChange = (zone: string) => {
    console.log('🌍 TechnicalDataSection - Changement zone:', zone);
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  // 🚨 DEBUG: Log avant rendu
  console.log('🎯 TechnicalDataSection - RENDU avec zone:', climateZone);

  return (
    <div className="border-b pb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Données techniques
        {/* 🚨 DEBUG: Afficher la zone dans le titre */}
        <span className="text-xs text-red-600 font-bold">[DEBUG: {climateZone}]</span>
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
