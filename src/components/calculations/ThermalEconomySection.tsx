
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThermalEconomyCalculations } from "@/hooks/useThermalEconomyCalculations";
import { ThermalZoneSync } from "../thermal/ThermalZoneSync";
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
  
  // 🚨 DEBUG CRITIQUE - ARRIVÉE DANS ThermalEconomySection
  console.error('🚨 ThermalEconomySection - ARRIVÉE zone (prop):', climateZone);
  console.error('🚨 ThermalEconomySection - Zone par défaut utilisée?', climateZone === "C3" ? "OUI - PROBLÈME!" : "NON - OK");
  console.error('🚨 ThermalEconomySection - Toutes les props:', {
    surfaceArea,
    uValueBefore,
    uValueAfter,
    climateZone,
    climateConfidence,
    climateMethod,
    climateReferenceCity,
    climateDistance
  });

  const {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    selectedClimateZone,
    setSelectedClimateZone,
    gCoefficient,
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

  // 🚨 DEBUG - Vérifier si le coefficient G est correct
  console.error('🚨 ThermalEconomySection - Coefficient G utilisé:', gCoefficient);
  console.error('🚨 ThermalEconomySection - Coefficient G pour', selectedClimateZone, ':', climateZoneCoefficients[selectedClimateZone]);
  console.error('🚨 ThermalEconomySection - Coefficient G pour D2 (attendu):', climateZoneCoefficients["D2"]);

  // 🔄 SYNCHRONISATION DIRECTE avec la géolocalisation
  useEffect(() => {
    console.error('🔄 ThermalEconomySection useEffect - climateZone changé:', climateZone);
    // Si on reçoit une zone de ClimateZoneDisplay, on l'utilise
    if (climateZone) {
      console.error('🔄 ThermalEconomySection - Synchronisation avec zone reçue:', climateZone);
      setSelectedClimateZone(climateZone);
    }
  }, [climateZone, setSelectedClimateZone]);

  // Gestionnaire pour le nouveau composant de zone thermique
  const handleThermalZoneUpdate = (zone: string, coefficient: number) => {
    console.error(`🚨 ThermalEconomySection - Mise à jour calculs avec Zone ${zone}, G=${coefficient}`);
    handleClimateZoneChange(zone);
    
    // Propager vers le parent (StatusBanner, etc.)
    if (onClimateZoneChange) {
      console.error('🚨 ThermalEconomySection - TRANSMISSION vers parent:', zone);
      onClimateZoneChange(zone);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Économie Thermique Annuelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ThermalZoneSync
            geolocatedZone={climateZone}
            onCoefficientChange={handleThermalZoneUpdate}
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
