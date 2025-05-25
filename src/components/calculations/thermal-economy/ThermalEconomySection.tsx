
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { climateZoneCoefficients, delegateMultipliers, DelegateType } from "./constants";
import ClimateZoneSelector from "./ClimateZoneSelector";
import DelegateSelector from "./DelegateSelector";
import CalculationsDisplay from "./CalculationsDisplay";
import CherryOption from "./CherryOption";

interface ThermalEconomySectionProps {
  surfaceArea: number;
  uValueBefore: number;
  uValueAfter: number;
  climateZone?: string;
  projectType: string;
  onClimateZoneChange?: (zone: string) => void;
}

const ThermalEconomySection = ({ 
  surfaceArea, 
  uValueBefore, 
  uValueAfter, 
  climateZone = "C3",
  projectType,
  onClimateZoneChange
}: ThermalEconomySectionProps) => {
  const [cherryEnabled, setCherryEnabled] = useState(false);
  const [delegate, setDelegate] = useState<DelegateType>("Eiffage");
  const [selectedClimateZone, setSelectedClimateZone] = useState(climateZone);
  
  // 🔧 FIX: Synchroniser la zone climatique avec la prop sans causer de boucle
  useEffect(() => {
    if (climateZone !== selectedClimateZone) {
      console.log('🌍 Synchronisation zone climatique dans ThermalEconomySection:', climateZone);
      setSelectedClimateZone(climateZone);
    }
  }, [climateZone]);

  // Get coefficient G based on selected climate zone
  const gCoefficient = climateZoneCoefficients[selectedClimateZone] || 46;
  
  // Get multiplier based on delegate
  const multiplier = delegateMultipliers[delegate];
  
  // Calculate annual savings in kWh/year
  const annualSavings = surfaceArea * (uValueBefore - uValueAfter) * gCoefficient;
  
  // Calculate project price in EUR
  const projectPrice = annualSavings * multiplier;
  
  // Calculate price per m²
  const pricePerSqm = projectPrice / surfaceArea;

  // 🔧 FIX: Gestionnaire de changement optimisé
  const handleClimateZoneChange = (zone: string) => {
    console.log('🌍 Changement zone climatique depuis ThermalEconomySection:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement immédiatement
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Économie Thermique Annuelle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClimateZoneSelector 
            selectedClimateZone={selectedClimateZone}
            onClimateZoneChange={handleClimateZoneChange}
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
          onCherryChange={setCherryEnabled}
          pricePerSqm={pricePerSqm}
          projectPrice={projectPrice}
        />
      </CardContent>
    </Card>
  );
};

export default ThermalEconomySection;
