
import { useState, useEffect } from "react";
import { climateZoneCoefficients } from "@/components/calculations/ThermalEconomySection";

// Delegate multipliers
const delegateMultipliers = {
  "Eiffage": 0.130,
  "GreenFlex": 0.115,
};

interface UseThermalEconomyCalculationsProps {
  surfaceArea: number;
  uValueBefore: number;
  uValueAfter: number;
  climateZone?: string;
  onClimateZoneChange?: (zone: string) => void;
}

export const useThermalEconomyCalculations = ({
  surfaceArea,
  uValueBefore,
  uValueAfter,
  climateZone = "C3",
  onClimateZoneChange
}: UseThermalEconomyCalculationsProps) => {
  const [cherryEnabled, setCherryEnabled] = useState(false);
  const [delegate, setDelegate] = useState<"Eiffage" | "GreenFlex">("Eiffage");
  const [selectedClimateZone, setSelectedClimateZone] = useState(climateZone);

  // 🔴 DIAGNOSTIC HOOK - VALEURS D'ENTRÉE
  console.log('🔴 DIAGNOSTIC useThermalEconomyCalculations - INPUTS:');
  console.log('  📊 surfaceArea:', surfaceArea);
  console.log('  📊 uValueBefore:', uValueBefore);
  console.log('  📊 uValueAfter:', uValueAfter);
  console.log('  🌍 climateZone (prop):', climateZone);
  console.log('  🌍 selectedClimateZone (state):', selectedClimateZone);

  // Synchronisation avec la zone climatique reçue
  useEffect(() => {
    console.log('🔄 HOOK useEffect - climateZone changé:', climateZone);
    if (climateZone && climateZone !== selectedClimateZone) {
      console.log('🔄 HOOK - Mise à jour selectedClimateZone:', climateZone);
      setSelectedClimateZone(climateZone);
    }
  }, [climateZone]);

  // Get coefficient G based on selected climate zone
  const gCoefficient = climateZoneCoefficients[selectedClimateZone] || 46;
  
  // Helper function to get coefficient for any zone
  const getCoefficient = (zone: string) => climateZoneCoefficients[zone] || 46;
  
  // Get multiplier based on delegate
  const multiplier = delegateMultipliers[delegate];
  
  // Calculate annual savings in kWh/year
  const annualSavings = surfaceArea * (uValueBefore - uValueAfter) * gCoefficient;
  
  // Calculate project price in EUR
  const projectPrice = annualSavings * multiplier;
  
  // Calculate price per m²
  const pricePerSqm = projectPrice / surfaceArea;
  
  // Calculate Cherry prices (10%)
  const cherryPricePerSqm = pricePerSqm * 0.1;
  const cherryProjectPrice = projectPrice * 0.1;
  
  // Total prices with Cherry
  const totalPricePerSqm = pricePerSqm + cherryPricePerSqm;
  const totalProjectPrice = projectPrice + cherryProjectPrice;

  // 🔴 DIAGNOSTIC HOOK - CALCULS INTERMÉDIAIRES
  console.log('🔴 DIAGNOSTIC useThermalEconomyCalculations - CALCULS:');
  console.log('  📈 gCoefficient (pour zone', selectedClimateZone, '):', gCoefficient);
  console.log('  👥 delegate:', delegate, '- multiplier:', multiplier);
  console.log('  📐 Delta U:', uValueBefore - uValueAfter);
  console.log('  📐 annualSavings calcul:', `${surfaceArea} × ${uValueBefore - uValueAfter} × ${gCoefficient} = ${annualSavings}`);
  console.log('  💰 projectPrice calcul:', `${annualSavings} × ${multiplier} = ${projectPrice}`);
  console.log('  💰 pricePerSqm calcul:', `${projectPrice} / ${surfaceArea} = ${pricePerSqm}`);

  const handleClimateZoneChange = (zone: string) => {
    console.log('🔄 HOOK handleClimateZoneChange appelé avec:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement vers le parent
    if (onClimateZoneChange) {
      console.log('🔄 HOOK - Propagation vers parent:', zone);
      onClimateZoneChange(zone);
    }
  };

  return {
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
  };
};
