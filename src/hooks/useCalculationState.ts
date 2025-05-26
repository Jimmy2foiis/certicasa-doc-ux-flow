
import { useState, useEffect } from "react";
import { useLayerManagement } from "./useLayerManagement";
import { useThermalResistanceSettings } from "./useThermalResistanceSettings";
import { useProjectSettings } from "./useProjectSettings";
import { useThermalCalculations } from "./useThermalCalculations";

export interface CalculationData {
  projectType: string;
  surfaceArea: string;
  roofArea: string;
  climateZone: string;
  beforeLayers: any[];
  afterLayers: any[];
  totalRBefore: number;
  totalRAfter: number;
  uValueBefore: number;
  uValueAfter: number;
  improvementPercent: number;
  meetsRequirements: boolean;
  bCoefficientBefore: number;
  bCoefficientAfter: number;
  ventilationBefore: any;
  ventilationAfter: any;
  ratioBefore: number;
  ratioAfter: number;
  rsiBefore: string;
  rseBefore: string;
  rsiAfter: string;
  rseAfter: string;
}

interface UseCalculationStateProps {
  savedData?: any;
  clientClimateZone?: string;
  floorType?: string;
}

export const useCalculationState = ({
  savedData,
  clientClimateZone = "C3",
  floorType = "Bois"
}: UseCalculationStateProps) => {
  // Gestion des paramètres du projet
  const projectSettings = useProjectSettings({ savedData });
  
  // Gestion des couches avec le type de plancher
  const layerManagement = useLayerManagement({
    savedBeforeLayers: savedData?.beforeLayers,
    savedAfterLayers: savedData?.afterLayers,
    floorType: floorType
  });

  // Gestion des paramètres de résistance thermique avec les surfaces
  const thermalSettings = useThermalResistanceSettings({
    savedData,
    surfaceArea: projectSettings.surfaceArea,
    roofArea: projectSettings.roofArea
  });

  // Calculs thermiques
  const thermalCalculations = useThermalCalculations({
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    ventilationBefore: projectSettings.ventilationBefore,
    ventilationAfter: projectSettings.ventilationAfter,
    ratioBefore: thermalSettings.ratioBefore,
    ratioAfter: thermalSettings.ratioAfter,
    rsiBefore: thermalSettings.rsiBefore,
    rseBefore: thermalSettings.rseBefore,
    rsiAfter: thermalSettings.rsiAfter,
    rseAfter: thermalSettings.rseAfter,
  });

  const calculationData: CalculationData = {
    projectType: projectSettings.projectType,
    surfaceArea: projectSettings.surfaceArea,
    roofArea: projectSettings.roofArea,
    climateZone: clientClimateZone,
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    ventilationBefore: projectSettings.ventilationBefore,
    ventilationAfter: projectSettings.ventilationAfter,
    ratioBefore: thermalSettings.ratioBefore,
    ratioAfter: thermalSettings.ratioAfter,
    rsiBefore: thermalSettings.rsiBefore,
    rseBefore: thermalSettings.rseBefore,
    rsiAfter: thermalSettings.rsiAfter,
    rseAfter: thermalSettings.rseAfter,
    ...thermalCalculations,
  };

  // Gestionnaires d'événements
  const handleAddLayer = (type: "before" | "after") => {
    console.log(`➕ Ajout couche ${type}`);
    // Cette fonction sera gérée par le composant parent
  };

  const handleUpdateLayer = (id: string, field: string, value: any) => {
    console.log(`✏️ Mise à jour couche ${id}:`, { field, value });
    if (field === "layer") {
      layerManagement.updateLayer("before", value);
      layerManagement.updateLayer("after", value);
    }
  };

  const handleDeleteBeforeLayer = (id: string) => {
    console.log(`🗑️ Suppression couche AVANT: ${id}`);
    const newLayers = layerManagement.beforeLayers.filter(layer => layer.id !== id);
    layerManagement.setBeforeLayers(newLayers);
  };

  const handleDeleteAfterLayer = (id: string) => {
    console.log(`🗑️ Suppression couche APRÈS: ${id}`);
    const newLayers = layerManagement.afterLayers.filter(layer => layer.id !== id);
    layerManagement.setAfterLayers(newLayers);
  };

  const handleAddSouflr47 = () => {
    console.log('➕ Ajout SOUFL\'R 47');
    layerManagement.addSouflr47();
  };

  return {
    calculationData,
    
    // Couches et gestion des couches
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    setBeforeLayers: layerManagement.setBeforeLayers,
    setAfterLayers: layerManagement.setAfterLayers,
    addLayer: layerManagement.addLayer,
    updateLayer: layerManagement.updateLayer,
    copyBeforeToAfter: layerManagement.copyBeforeToAfter,
    
    // Gestionnaires d'événements
    handleAddLayer,
    handleUpdateLayer,
    handleDeleteBeforeLayer,
    handleDeleteAfterLayer,
    handleAddSouflr47,
    addSouflr47: handleAddSouflr47,
    
    // Paramètres thermiques complets
    thermalSettings: {
      ...thermalSettings,
      setVentilationBefore: projectSettings.setVentilationBefore,
      setVentilationAfter: projectSettings.setVentilationAfter,
    },
    
    // Accès direct aux setters pour les surfaces
    setSurfaceArea: projectSettings.setSurfaceArea,
    setRoofArea: projectSettings.setRoofArea,
    
    // Setters climat (pour compatibilité)
    setClimateZone: (zone: string) => {
      console.log('🌡️ Zone climatique changée:', zone);
      // Zone climatique gérée au niveau parent
    },
  };
};
