
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThermalEconomyCalculations } from "@/hooks/useThermalEconomyCalculations";
import ClimateZoneSelector from "./thermal-economy/ClimateZoneSelector";
import DelegateSelector from "./thermal-economy/DelegateSelector";
import CalculationsDisplay from "./thermal-economy/CalculationsDisplay";
import CherryOption from "./thermal-economy/CherryOption";
import { useEffect } from "react";

// Climate zone coefficients mapping
export const climateZoneCoefficients: Record<string, number> = {
  "A3": 25,
  "A4": 26,
  "B3": 32,
  "B4": 33,
  "C1": 44,
  "C2": 45,
  "C3": 46,
  "C4": 46,
  "D1": 60,
  "D2": 60,
  "D3": 61,
  "E1": 74,
};

interface ThermalEconomySectionProps {
  surfaceArea: number;
  uValueBefore: number;
  uValueAfter: number;
  climateZone?: string;
  projectType: string;
  climateConfidence?: number;
  climateMethod?: string;
  climateReferenceCity?: string;
  climateDistance?: number;
  climateDescription?: string;
  onClimateZoneChange?: (zone: string) => void;
}

const ThermalEconomySection = ({ 
  surfaceArea, 
  uValueBefore, 
  uValueAfter, 
  climateZone = "C3",
  projectType,
  climateConfidence,
  climateMethod,
  climateReferenceCity,
  climateDistance,
  climateDescription,
  onClimateZoneChange
}: ThermalEconomySectionProps) => {
  
  // 🐛 DEBUG: Tracer la réception de la zone climatique
  console.log('🌍 ThermalEconomySection - zone reçue:', climateZone);
  console.log('🌍 ThermalEconomySection - props complètes:', {
    climateZone,
    climateConfidence,
    climateMethod,
    climateReferenceCity
  });

  const {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    selectedClimateZone,
    getCoefficient,
    annualSavings,
    projectPrice,
    pricePerSqm,
    cherryPricePerSqm,
    cherryProjectPrice,
    totalPricePerSqm,
    totalProjectPrice,
    handleClimateZoneChange
  } = useThermalEconomyCalculations({
    surfaceArea,
    uValueBefore,
    uValueAfter,
    climateZone,
    onClimateZoneChange
  });

  // 🛠️ FORCER la synchronisation quand la zone change
  useEffect(() => {
    console.log('🔧 ThermalEconomy - Mise à jour zone forcée:', climateZone);
    if (climateZone && climateZone !== selectedClimateZone) {
      console.log('🔄 ThermalEconomy - Synchronisation zone:', climateZone, '->', selectedClimateZone);
      handleClimateZoneChange(climateZone);
    }
  }, [climateZone, selectedClimateZone, handleClimateZoneChange]);

  // 🐛 DEBUG: Afficher la zone sélectionnée dans le hook
  console.log('🎯 ThermalEconomySection - zone sélectionnée dans le hook:', selectedClimateZone);

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Économie Thermique Annuelle 
          {/* 🐛 DEBUG: Afficher la zone dans le titre pour vérifier */}
          <span className="text-sm text-gray-500 ml-2">(Zone: {selectedClimateZone})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClimateZoneSelector
            selectedClimateZone={selectedClimateZone}
            onClimateZoneChange={handleClimateZoneChange}
            getCoefficient={getCoefficient}
            climateConfidence={climateConfidence}
            climateMethod={climateMethod}
            climateReferenceCity={climateReferenceCity}
            climateDistance={climateDistance}
            climateDescription={climateDescription}
          />
          
          <DelegateSelector
            delegate={delegate}
            onDelegateChange={setDelegate}
          />
        </div>
        
        <CalculationsDisplay
          annualSavings={annualSavings}
          projectPrice={projectPrice}
          pricePerSqm={pricePerSqm}
        />
        
        <CherryOption
          cherryEnabled={cherryEnabled}
          onCherryEnabledChange={setCherryEnabled}
          pricePerSqm={pricePerSqm}
          projectPrice={projectPrice}
          cherryPricePerSqm={cherryPricePerSqm}
          cherryProjectPrice={cherryProjectPrice}
          totalPricePerSqm={totalPricePerSqm}
          totalProjectPrice={totalProjectPrice}
        />
      </CardContent>
    </Card>
  );
};

export default ThermalEconomySection;
