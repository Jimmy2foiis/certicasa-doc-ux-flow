
import { useState } from "react";
import { climateZoneCoefficients } from "@/components/calculations/ThermalEconomySection";

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

  console.log('🧮 useThermalEconomyCalculations - Zone reçue:', climateZone);
  
  const gCoefficient = climateZoneCoefficients[climateZone] || 46;
  console.log('🧮 useThermalEconomyCalculations - Coefficient G:', gCoefficient);
  
  const multiplier = delegateMultipliers[delegate];
  const annualSavings = surfaceArea * (uValueBefore - uValueAfter) * gCoefficient;
  const projectPrice = annualSavings * multiplier;
  const pricePerSqm = projectPrice / surfaceArea;
  const cherryPricePerSqm = pricePerSqm * 0.1;
  const cherryProjectPrice = projectPrice * 0.1;
  const totalPricePerSqm = pricePerSqm + cherryPricePerSqm;
  const totalProjectPrice = projectPrice + cherryProjectPrice;

  console.log('🧮 Calcul CAE:', surfaceArea, '×', (uValueBefore - uValueAfter), '×', gCoefficient, '=', annualSavings);

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
