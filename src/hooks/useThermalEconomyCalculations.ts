
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
  climateZone: string;
}

export const useThermalEconomyCalculations = ({
  surfaceArea,
  uValueBefore,
  uValueAfter,
  climateZone
}: UseThermalEconomyCalculationsProps) => {
  const [cherryEnabled, setCherryEnabled] = useState(false);
  const [delegate, setDelegate] = useState<"Eiffage" | "GreenFlex">("Eiffage");

  // 🚨 DEBUG TRÈS DÉTAILLÉ HOOK
  console.error('🚨 useThermalEconomyCalculations - PARAMETRES:');
  console.error('🚨 climateZone param type:', typeof climateZone);
  console.error('🚨 climateZone param value:', climateZone);
  console.error('🚨 climateZone param length:', climateZone?.length);
  console.error('🚨 climateZone param chars:', climateZone?.split('').map((c, i) => `[${i}]=${c}`));
  console.error('🚨 climateZone === "D2":', climateZone === "D2");
  console.error('🚨 climateZone in coefficients:', climateZone in climateZoneCoefficients);
  console.error('🚨 Raw lookup result:', climateZoneCoefficients[climateZone]);
  console.error('🚨 All coefficient keys:', Object.keys(climateZoneCoefficients));
  
  // Obtenir le coefficient G directement
  const gCoefficient = climateZoneCoefficients[climateZone] || 46;
  
  console.error('🚨 Final gCoefficient:', gCoefficient);
  console.error('🚨 surfaceArea:', surfaceArea);
  console.error('🚨 uValueBefore:', uValueBefore);
  console.error('🚨 uValueAfter:', uValueAfter);
  console.error('🚨 delta U:', uValueBefore - uValueAfter);
  
  // Get multiplier based on delegate
  const multiplier = delegateMultipliers[delegate];
  
  // Calculate annual savings in kWh/year
  const annualSavings = surfaceArea * (uValueBefore - uValueAfter) * gCoefficient;
  
  console.error('🚨 Calcul CAE:', surfaceArea, '×', (uValueBefore - uValueAfter), '×', gCoefficient, '=', annualSavings);
  
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

  return {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    gCoefficient,
    annualSavings,
    projectPrice,
    pricePerSqm,
    cherryPricePerSqm,
    cherryProjectPrice,
    totalPricePerSqm,
    totalProjectPrice
  };
};
