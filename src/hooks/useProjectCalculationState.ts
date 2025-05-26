import { useCadastralData } from "@/hooks/useCadastralData";
import { useCalculationState } from "@/hooks/useCalculationState";
import { useState, useEffect } from "react";

interface UseProjectCalculationStateProps {
  clientId?: string;
  savedData?: any;
  clientClimateZone?: string;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  geolocatedClimateZone?: string;
}

export const useProjectCalculationState = ({
  clientId,
  savedData,
  clientClimateZone,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois",
  geolocatedClimateZone
}: UseProjectCalculationStateProps) => {
  // États locaux pour les surfaces
  const [localSurfaceArea, setLocalSurfaceArea] = useState(surfaceArea);
  const [localRoofArea, setLocalRoofArea] = useState(roofArea);
  const [localFloorType, setLocalFloorType] = useState(floorType);
  const [localClimateZone, setLocalClimateZone] = useState(geolocatedClimateZone || clientClimateZone || "C3");

  // Synchroniser avec les props
  useEffect(() => {
    setLocalSurfaceArea(surfaceArea);
  }, [surfaceArea]);

  useEffect(() => {
    setLocalRoofArea(roofArea);
  }, [roofArea]);

  useEffect(() => {
    setLocalFloorType(floorType);
  }, [floorType]);

  // Priorité à la zone géolocalisée
  useEffect(() => {
    if (geolocatedClimateZone) {
      console.log('🌍 useProjectCalculationState - Zone géolocalisée reçue:', geolocatedClimateZone);
      setLocalClimateZone(geolocatedClimateZone);
    } else if (clientClimateZone) {
      setLocalClimateZone(clientClimateZone);
    }
  }, [geolocatedClimateZone, clientClimateZone]);

  // Get climate zone from cadastral data (for demo purposes)
  const { climateZone: fetchedClimateZone } = useCadastralData(clientId ? `Client ID ${clientId}` : "123 Demo Street");
  
  const calculationState = useCalculationState({
    savedData: {
      ...savedData,
      surfaceArea: localSurfaceArea,
      roofArea: localRoofArea,
      climateZone: localClimateZone
    },
    clientClimateZone: clientClimateZone,
    floorType: localFloorType,
    geolocatedClimateZone: geolocatedClimateZone
  });

  // Gestionnaires pour propager les changements avec synchronisation immédiate
  const handleSurfaceAreaChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Surface combles mise à jour:', value, '-> Synchronisation calculs');
    setLocalSurfaceArea(value);
    calculationState.setSurfaceArea(value);
  };

  const handleRoofAreaChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Surface toiture mise à jour:', value, '-> Synchronisation calculs');
    setLocalRoofArea(value);
    calculationState.setRoofArea(value);
  };

  const handleFloorTypeChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Type plancher mis à jour:', value, '-> Synchronisation matériaux');
    setLocalFloorType(value);
  };

  const handleClimateZoneChange = (value: string) => {
    console.log('📊 useProjectCalculationState - Zone climatique mise à jour:', value);
    setLocalClimateZone(value);
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
    
    // Exposer toutes les propriétés du calculationState sans duplication
    beforeLayers: calculationState.beforeLayers,
    afterLayers: calculationState.afterLayers,
    setBeforeLayers: calculationState.setBeforeLayers,
    setAfterLayers: calculationState.setAfterLayers,
    addLayer: calculationState.addLayer,
    updateLayer: calculationState.updateLayer,
    copyBeforeToAfter: calculationState.copyBeforeToAfter,
    handleAddLayer: calculationState.handleAddLayer,
    handleUpdateLayer: calculationState.handleUpdateLayer,
    handleDeleteBeforeLayer: calculationState.handleDeleteBeforeLayer,
    handleDeleteAfterLayer: calculationState.handleDeleteAfterLayer,
    handleAddSouflr47: calculationState.handleAddSouflr47,
    addSouflr47: calculationState.addSouflr47,
    thermalSettings: calculationState.thermalSettings,
    setSurfaceArea: calculationState.setSurfaceArea,
    setRoofArea: calculationState.setRoofArea,
    setClimateZone: calculationState.setClimateZone,
    
    // Exposer les setters des paramètres thermiques
    setVentilationBefore: calculationState.thermalSettings?.setVentilationBefore,
    setVentilationAfter: calculationState.thermalSettings?.setVentilationAfter,
    setRsiBefore: calculationState.thermalSettings?.setRsiBefore,
    setRseBefore: calculationState.thermalSettings?.setRseBefore,
    setRsiAfter: calculationState.thermalSettings?.setRsiAfter,
    setRseAfter: calculationState.thermalSettings?.setRseAfter,
    setRatioBefore: calculationState.thermalSettings?.setRatioBefore,
    setRatioAfter: calculationState.thermalSettings?.setRatioAfter,
  };
};
