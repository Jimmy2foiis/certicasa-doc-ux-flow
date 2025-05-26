
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

  // 🔴 DEBUG HOOK - Vérifier la zone reçue
  console.error('🔴 useThermalEconomyCalculations - Zone reçue:', climateZone);
  console.error('🔴 useThermalEconomyCalculations - Zone par défaut utilisée?', climateZone === "C3" ? "OUI - PROBLÈME!" : "NON - OK");

  // Utiliser DIRECTEMENT la zone reçue, pas d'état local
  const gCoefficient = climateZoneCoefficients[climateZone] || 46;
  
  // 🔴 DEBUG - Vérification coefficient
  console.error('🔴 useThermalEconomyCalculations - Coefficient G calculé:', gCoefficient);
  console.error('🔴 useThermalEconomyCalculations - Pour zone:', climateZone);
  if (climateZone === "D2") {
    console.error('🔴 PARFAIT! Zone D2 détectée avec G=60');
  } else {
    console.error('🔴 PROBLÈME! Zone devrait être D2, pas', climateZone);
  }
  
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

  // 🔴 DEBUG - CALCULS FINAUX
  console.error('🔴 useThermalEconomyCalculations - CALCUL FINAL:');
  console.error(`🔴 CAE = ${surfaceArea} × (${uValueBefore} - ${uValueAfter}) × ${gCoefficient} = ${annualSavings}`);
  if (climateZone !== "D2") {
    console.error('🔴 Si zone était D2 (G=60), CAE serait:', surfaceArea * (uValueBefore - uValueAfter) * 60);
  }

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
