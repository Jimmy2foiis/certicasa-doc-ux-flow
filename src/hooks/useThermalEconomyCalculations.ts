
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

  // 🚨 DEBUG HOOK - ENTRÉE
  console.error('🚨 useThermalEconomyCalculations - Zone reçue (prop):', climateZone);
  console.error('🚨 useThermalEconomyCalculations - selectedClimateZone (state):', selectedClimateZone);
  console.error('🚨 useThermalEconomyCalculations - Zone par défaut utilisée?', climateZone === "C3" ? "OUI - PROBLÈME!" : "NON - OK");

  // Synchronisation avec la zone climatique reçue
  useEffect(() => {
    console.error('🚨 useThermalEconomyCalculations useEffect - climateZone changé:', climateZone);
    if (climateZone && climateZone !== selectedClimateZone) {
      console.error('🚨 useThermalEconomyCalculations - Mise à jour selectedClimateZone:', climateZone);
      setSelectedClimateZone(climateZone);
    }
  }, [climateZone]);

  // Get coefficient G based on selected climate zone
  const gCoefficient = climateZoneCoefficients[selectedClimateZone] || 46;
  
  // 🚨 DEBUG - Vérification coefficient
  console.error('🚨 useThermalEconomyCalculations - Coefficient G calculé:', gCoefficient);
  console.error('🚨 useThermalEconomyCalculations - Pour zone:', selectedClimateZone);
  console.error('🚨 useThermalEconomyCalculations - Si c\'était D2, G serait:', climateZoneCoefficients["D2"]);
  
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

  // 🚨 DEBUG - CALCULS FINAUX
  console.error('🚨 useThermalEconomyCalculations - CALCUL FINAL:');
  console.error(`🚨 CAE = ${surfaceArea} × (${uValueBefore} - ${uValueAfter}) × ${gCoefficient} = ${annualSavings}`);
  console.error('🚨 Si zone était D2 (G=60), CAE serait:', surfaceArea * (uValueBefore - uValueAfter) * 60);

  const handleClimateZoneChange = (zone: string) => {
    console.error('🚨 useThermalEconomyCalculations handleClimateZoneChange appelé avec:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement vers le parent
    if (onClimateZoneChange) {
      console.error('🚨 useThermalEconomyCalculations - Propagation vers parent:', zone);
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
