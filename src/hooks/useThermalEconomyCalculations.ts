
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
  
  // 🚨 DEBUG URGENT: Tracer toutes les valeurs d'entrée
  console.log('🔗 useThermalEconomyCalculations - PROPS D\'ENTRÉE:', {
    surfaceArea,
    uValueBefore,
    uValueAfter,
    climateZone,
    selectedClimateZone
  });
  
  // 🚨 DEBUG: Effet d'initialisation
  useEffect(() => {
    console.log('🔄 Hook ThermalEconomy - INITIALISATION:', {
      climateZoneReçue: climateZone,
      selectedClimateZoneActuel: selectedClimateZone
    });
    
    if (climateZone && !selectedClimateZone) {
      console.log('🎯 Hook ThermalEconomy - Initialisation zone climatique:', climateZone);
      setSelectedClimateZone(climateZone);
    }
  }, []);

  // 🚨 DEBUG: Synchronisation forcée
  useEffect(() => {
    console.log('🔄 Hook ThermalEconomy - SYNCHRONISATION:', {
      climateZoneReçue: climateZone,
      selectedClimateZoneActuel: selectedClimateZone,
      sontDifférents: climateZone !== selectedClimateZone
    });
    
    if (climateZone && climateZone !== selectedClimateZone) {
      console.log('🌍 Hook ThermalEconomy - FORCER la synchronisation:', climateZone);
      setSelectedClimateZone(climateZone);
      
      // Propager immédiatement le changement
      if (onClimateZoneChange) {
        console.log('🔄 Hook ThermalEconomy - Propagation vers parent:', climateZone);
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

  // 🚨 DEBUG: Gestionnaire de changement optimisé
  const handleClimateZoneChange = (zone: string) => {
    console.log('🌍 Hook ThermalEconomy - CHANGEMENT MANUEL zone:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement vers le parent
    if (onClimateZoneChange) {
      console.log('🔄 Hook ThermalEconomy - Propagation changement manuel:', zone);
      onClimateZoneChange(zone);
    }
  };

  // 🚨 DEBUG: Afficher les valeurs calculées
  console.log('✅ Hook ThermalEconomy - VALEURS FINALES:', {
    selectedClimateZone,
    gCoefficient,
    annualSavings: annualSavings.toFixed(2),
    projectPrice: projectPrice.toFixed(2)
  });

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
