
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
  
  // 🔥 SYNCHRONISATION AUTOMATIQUE avec la zone climatique déterminée
  useEffect(() => {
    if (climateZone && climateZone !== selectedClimateZone) {
      console.log('🌍 Synchronisation automatique zone climatique dans ThermalEconomySection:', climateZone);
      setSelectedClimateZone(climateZone);
      // Propager immédiatement le changement pour mettre à jour le coefficient G
      if (onClimateZoneChange) {
        onClimateZoneChange(climateZone);
      }
    }
  }, [climateZone, selectedClimateZone, onClimateZoneChange]);

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

  // 🔧 Gestionnaire de changement optimisé avec propagation
  const handleClimateZoneChange = (zone: string) => {
    console.log('🌍 Changement zone climatique manuel depuis ThermalEconomySection:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement vers le parent pour synchroniser avec les autres composants
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  return {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    selectedClimateZone,
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
