
import { useState } from "react";
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

  // 🚨 DEBUG HOOK - Analyser EXACTEMENT ce qui arrive
  console.error('🚨 useThermalEconomyCalculations - ANALYSE:');
  console.error('🚨 climateZone reçu:', climateZone, 'Type:', typeof climateZone);
  console.error('🚨 climateZone.length:', climateZone?.length);
  console.error('🚨 Valide?', climateZone in climateZoneCoefficients);

  // Utiliser DIRECTEMENT la zone reçue
  const gCoefficient = climateZoneCoefficients[climateZone] || 46;
  
  console.error('🚨 useThermalEconomyCalculations - Coefficient G final:', gCoefficient);
  console.error('🚨 useThermalEconomyCalculations - Pour zone:', climateZone);
  
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

  console.error('🚨 useThermalEconomyCalculations - CALCUL FINAL:');
  console.error(`🚨 CAE = ${surfaceArea} × (${uValueBefore.toFixed(3)} - ${uValueAfter.toFixed(3)}) × ${gCoefficient} = ${annualSavings.toFixed(1)}`);
  console.error('🚨 Prix projet:', projectPrice.toFixed(2), '€');

  return {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    gCoefficient,
    getCoefficient,
    annualSavings,
    projectPrice,
    pricePerSqm,
    cherryPricePerSqm,
    cherryProjectPrice,
    totalPricePerSqm,
    totalProjectPrice
  };
};
