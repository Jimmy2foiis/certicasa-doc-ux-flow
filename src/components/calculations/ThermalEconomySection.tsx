
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
  
  // 🔴 DIAGNOSTIC COMPLET - TOUTES LES VALEURS D'ENTRÉE
  console.log('🔴 DIAGNOSTIC ThermalEconomySection - VALEURS D\'ENTRÉE:');
  console.log('  📊 surfaceArea:', surfaceArea);
  console.log('  📊 uValueBefore:', uValueBefore);
  console.log('  📊 uValueAfter:', uValueAfter);
  console.log('  🌍 climateZone (prop):', climateZone);
  console.log('  🏗️ projectType:', projectType);
  console.log('  ℹ️ climateConfidence:', climateConfidence);
  console.log('  ℹ️ climateMethod:', climateMethod);
  console.log('  ℹ️ climateReferenceCity:', climateReferenceCity);
  console.log('  ℹ️ climateDistance:', climateDistance);

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

  // 🔴 DIAGNOSTIC COMPLET - VALEURS DU HOOK
  console.log('🔴 DIAGNOSTIC useThermalEconomyCalculations - VALEURS DE SORTIE:');
  console.log('  🌍 selectedClimateZone:', selectedClimateZone);
  console.log('  📈 gCoefficient:', gCoefficient);
  console.log('  👥 delegate:', delegate);
  console.log('  🍒 cherryEnabled:', cherryEnabled);
  console.log('  💰 annualSavings:', annualSavings);
  console.log('  💰 projectPrice:', projectPrice);
  console.log('  💰 pricePerSqm:', pricePerSqm);
  console.log('  💰 cherryPricePerSqm:', cherryPricePerSqm);
  console.log('  💰 totalProjectPrice:', totalProjectPrice);

  // 🔄 SYNCHRONISATION DIRECTE avec la géolocalisation
  useEffect(() => {
    console.log('🔄 SYNCHRONISATION - climateZone changé:', climateZone);
    // Si on reçoit une zone de ClimateZoneDisplay, on l'utilise
    if (climateZone) {
      setSelectedClimateZone(climateZone);
      console.log('🔄 Zone Thermique synchronisée:', climateZone);
    }
  }, [climateZone, setSelectedClimateZone]);

  // Gestionnaire pour le nouveau composant de zone thermique
  const handleThermalZoneUpdate = (zone: string, coefficient: number) => {
    console.log(`📊 Mise à jour calculs avec Zone ${zone}, G=${coefficient}`);
    handleClimateZoneChange(zone);
    
    // Propager vers le parent (StatusBanner, etc.)
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  // 🔴 DIAGNOSTIC FINAL - CALCULS UTILISÉS
  console.log('🔴 DIAGNOSTIC FINAL - CALCULS UTILISÉS:');
  console.log('  📐 Formule CAE: Surface × (UBefore - UAfter) × G');
  console.log('  📐 Calcul détaillé:', `${surfaceArea} × (${uValueBefore} - ${uValueAfter}) × ${gCoefficient} = ${annualSavings}`);
  console.log('  📐 Delta U:', uValueBefore - uValueAfter);

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
