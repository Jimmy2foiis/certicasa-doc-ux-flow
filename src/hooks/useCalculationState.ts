import { useState, useEffect, useMemo } from "react";
import { useLayerManagement, Layer } from "./useLayerManagement";
import { useThermalCalculations } from "./useThermalCalculations";
import { useThermalResistanceSettings } from "./useThermalResistanceSettings";

export interface CalculationData {
  beforeLayers: Layer[];
  afterLayers: Layer[];
  thermalSettings: any;
  surfaceArea: string;
  roofArea: string;
  climateZone: string;
  uValueBefore: number;
  uValueAfter: number;
  improvementPercent: number;
  projectType: string;
}

interface UseCalculationStateProps {
  savedData?: any;
  clientClimateZone?: string;
  floorType?: string;
}

export const useCalculationState = ({ 
  savedData, 
  clientClimateZone, // Utiliser la vraie zone climatique du client
  floorType 
}: UseCalculationStateProps) => {
  
  // États pour les données de base
  const [surfaceArea, setSurfaceArea] = useState("70");
  const [roofArea, setRoofArea] = useState("85");
  const [climateZone, setClimateZone] = useState(clientClimateZone || "C3"); // Utiliser la vraie zone

  const layerManagement = useLayerManagement({
    savedBeforeLayers: savedData?.beforeLayers,
    savedAfterLayers: savedData?.afterLayers,
    floorType
  });

  const thermalCalculations = useThermalCalculations({
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    surfaceArea,
    roofArea,
    climateZone
  });

  const thermalSettings = useThermalResistanceSettings({
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    onBeforeLayersChange: layerManagement.setBeforeLayers,
    onAfterLayersChange: layerManagement.setAfterLayers
  });

  // Charger les données sauvegardées
  useEffect(() => {
    if (savedData) {
      console.log('🔄 Chargement données thermiques sauvegardées:', savedData);
      
      if (savedData.surfaceArea) {
        setSurfaceArea(savedData.surfaceArea);
      }
      
      if (savedData.roofArea) {
        setRoofArea(savedData.roofArea);
      }
      
      if (savedData.climateZone) {
        setClimateZone(savedData.climateZone);
      } else if (clientClimateZone) {
        // Si pas de zone sauvegardée, utiliser la zone climatique du client
        setClimateZone(clientClimateZone);
      }
    } else if (clientClimateZone) {
      // Si pas de données sauvegardées, utiliser la zone climatique du client
      setClimateZone(clientClimateZone);
    }
  }, [savedData, clientClimateZone]);

  // Synchroniser avec la zone climatique du client quand elle change
  useEffect(() => {
    if (clientClimateZone && clientClimateZone !== climateZone) {
      console.log('🌡️ Synchronisation zone climatique:', climateZone, '->', clientClimateZone);
      setClimateZone(clientClimateZone);
    }
  }, [clientClimateZone]);

  const calculationData: CalculationData = useMemo(() => ({
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    thermalSettings,
    surfaceArea,
    roofArea,
    climateZone,
    uValueBefore: thermalCalculations.uValueBefore,
    uValueAfter: thermalCalculations.uValueAfter,
    improvementPercent: thermalCalculations.improvementPercent,
    projectType: "RES010"
  }), [
    layerManagement.beforeLayers,
    layerManagement.afterLayers,
    thermalSettings,
    surfaceArea,
    roofArea,
    climateZone,
    thermalCalculations.uValueBefore,
    thermalCalculations.uValueAfter,
    thermalCalculations.improvementPercent
  ]);

  const handleAddLayer = (type: "before" | "after") => {
    const defaultMaterial = {
      id: Date.now().toString(),
      name: "Sélectionnez un matériau",
      thickness: 10,
      lambda: 0.5,
      r: 0.02
    };
    layerManagement.addLayer(type, defaultMaterial);
  };

  const handleUpdateLayer = (id: string, field: string, updatedLayer: any) => {
    console.log(`✏️ Mise à jour couche ${id}:`, { field, value: updatedLayer });
    
    const isBeforeLayer = layerManagement.beforeLayers.some(l => l.id === id);
    const isAfterLayer = layerManagement.afterLayers.some(l => l.id === id);
    
    if (isBeforeLayer) {
      layerManagement.updateLayer("before", updatedLayer);
    } else if (isAfterLayer) {
      layerManagement.updateLayer("after", updatedLayer);
    }
  };

  const handleDeleteBeforeLayer = (id: string) => {
    const newBeforeLayers = layerManagement.beforeLayers.filter(l => l.id !== id);
    layerManagement.setBeforeLayers([...newBeforeLayers]);
  };

  const handleDeleteAfterLayer = (id: string) => {
    const newAfterLayers = layerManagement.afterLayers.filter(l => l.id !== id);
    layerManagement.setAfterLayers([...newAfterLayers]);
  };

  const handleAddSouflr47 = () => {
    layerManagement.addSouflr47();
  };

  return {
    calculationData,
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    setBeforeLayers: layerManagement.setBeforeLayers,
    setAfterLayers: layerManagement.setAfterLayers,
    addLayer: layerManagement.addLayer,
    updateLayer: layerManagement.updateLayer,
    copyBeforeToAfter: layerManagement.copyBeforeToAfter,
    handleAddLayer,
    handleUpdateLayer,
    handleDeleteBeforeLayer,
    handleDeleteAfterLayer,
    handleAddSouflr47,
    addSouflr47: layerManagement.addSouflr47,
    thermalSettings,
    setSurfaceArea,
    setRoofArea,
    setClimateZone
  };
};
