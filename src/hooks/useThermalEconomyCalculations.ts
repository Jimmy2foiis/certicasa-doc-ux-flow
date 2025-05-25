
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
  
  // 🐛 DEBUG: Tracer la réception de la zone dans le hook
  console.log('🔗 useThermalEconomyCalculations - zone reçue:', climateZone);
  console.log('🔗 useThermalEconomyCalculations - zone sélectionnée:', selectedClimateZone);
  
  // 🔥 SYNCHRONISATION IMMÉDIATE et FORCÉE avec la zone climatique déterminée
  useEffect(() => {
    console.log('🔄 Hook - Effect de synchronisation déclenché:', { climateZone, selectedClimateZone });
    
    if (climateZone && climateZone !== selectedClimateZone) {
      console.log('🌍 Hook - Synchronisation automatique zone climatique:', climateZone);
      setSelectedClimateZone(climateZone);
      
      // Propager immédiatement le changement pour mettre à jour le coefficient G
      if (onClimateZoneChange) {
        console.log('🔄 Hook - Propagation du changement vers le parent:', climateZone);
        onClimateZoneChange(climateZone);
      }
    }
  }, [climateZone, selectedClimateZone, onClimateZoneChange]);

  // 🔄 INITIALISATION: S'assurer que la zone est correctement initialisée au premier rendu
  useEffect(() => {
    if (climateZone && !selectedClimateZone) {
      console.log('🎯 Hook - Initialisation zone climatique:', climateZone);
      setSelectedClimateZone(climateZone);
    }
  }, [climateZone, selectedClimateZone]);

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
    console.log('🌍 Hook - Changement zone climatique manuel:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement vers le parent pour synchroniser avec les autres composants
    if (onClimateZoneChange) {
      console.log('🔄 Hook - Propagation vers parent du changement manuel:', zone);
      onClimateZoneChange(zone);
    }
  };

  // 🐛 DEBUG: Afficher les valeurs finales
  console.log('✅ Hook - Valeurs finales:', {
    selectedClimateZone,
    gCoefficient,
    annualSavings: annualSavings.toFixed(2)
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
