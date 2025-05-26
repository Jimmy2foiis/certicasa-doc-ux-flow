
import { useCadastralData } from "@/hooks/useCadastralData";
import { useCalculationState } from "@/hooks/useCalculationState";
import { useState } from "react";

interface UseProjectCalculationStateProps {
  clientId?: string;
  savedData?: any;
  clientClimateZone?: string;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
}

export const useProjectCalculationState = ({
  clientId,
  savedData,
  clientClimateZone,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois"
}: UseProjectCalculationStateProps) => {
  // États locaux pour les surfaces
  const [localSurfaceArea, setLocalSurfaceArea] = useState(surfaceArea);
  const [localRoofArea, setLocalRoofArea] = useState(roofArea);
  const [localFloorType, setLocalFloorType] = useState(floorType);
  const [localClimateZone, setLocalClimateZone] = useState(clientClimateZone || "C3");

  // Get climate zone from cadastral data (for demo purposes)
  const { climateZone: fetchedClimateZone } = useCadastralData(clientId ? `Client ID ${clientId}` : "123 Demo Street");
  
  const calculationState = useCalculationState({
    savedData: {
      ...savedData,
      surfaceArea: localSurfaceArea,
      roofArea: localRoofArea,
      climateZone: localClimateZone
    },
    clientClimateZone: localClimateZone,
    floorType: localFloorType
  });

  // Gestionnaires pour propager les changements
  const handleSurfaceAreaChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Surface combles:', value);
    setLocalSurfaceArea(value);
    calculationState.setSurfaceArea(value);
  };

  const handleRoofAreaChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Surface toiture:', value);
    setLocalRoofArea(value);
    calculationState.setRoofArea(value);
  };

  const handleFloorTypeChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Type plancher:', value);
    setLocalFloorType(value);
    // Le changement de type de plancher est géré par useLayerManagement
  };

  const handleClimateZoneChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Zone climatique:', value);
    setLocalClimateZone(value);
    // Le changement de zone climatique est géré par le système de calcul
  };

  return {
    // Données de calcul
    calculationData: calculationState.calculationData,
    
    // Climat
    fetchedClimateZone,
    climateZone: localClimateZone,
    
    // Gestionnaires d'événements pour les surfaces
    handleSurfaceAreaChange,
    handleRoofAreaChange,
    handleFloorTypeChange,
    handleClimateZoneChange,
    
    // Accès direct aux setters pour les surfaces
    setSurfaceArea: calculationState.setSurfaceArea,
    setRoofArea: calculationState.setRoofArea,
    
    // Exposer toutes les propriétés du calculationState
    ...calculationState,
    
    // Exposer les setters manquants des paramètres thermiques
    setVentilationBefore: calculationState.thermalSettings?.setVentilationBefore,
    setVentilationAfter: calculationState.thermalSettings?.setVentilationAfter,
    setRsiBefore: calculationState.thermalSettings?.setRsiBefore,
    setRseBefore: calculationState.thermalSettings?.setRseBefore,
    setRsiAfter: calculationState.thermalSettings?.setRsiAfter,
    setRseAfter: calculationState.thermalSettings?.setRseAfter,
    setRatioBefore: calculationState.thermalSettings?.setRatioBefore,
    setRatioAfter: calculationState.thermalSettings?.setRatioAfter,
    copyBeforeToAfter: calculationState.thermalSettings?.copyBeforeToAfter,
  };
};
