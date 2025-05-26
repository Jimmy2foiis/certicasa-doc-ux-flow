import { useState, useEffect, useMemo } from "react";
import { useLayerManagement, Layer } from "./useLayerManagement";
import { useThermalCalculations } from "./useThermalCalculations";
import { useThermalResistanceSettings } from "./useThermalResistanceSettings";
import { VentilationType } from "@/utils/calculationUtils";

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
  totalRBefore: number;
  totalRAfter: number;
  bCoefficientBefore: number;
  bCoefficientAfter: number;
  rsiBefore: string;
  rseBefore: string;
  rsiAfter: string;
  rseAfter: string;
  ventilationBefore: VentilationType;
  ventilationAfter: VentilationType;
  ratioBefore: number;
  ratioAfter: number;
}

interface UseCalculationStateProps {
  savedData?: any;
  realClimateZone?: string;
  floorType?: string;
  geolocatedClimateZone?: string;
}

export const useCalculationState = ({ 
  savedData, 
  realClimateZone,
  floorType,
  geolocatedClimateZone
}: UseCalculationStateProps) => {
  
  // États pour les données de base
  const [surfaceArea, setSurfaceArea] = useState("70");
  const [roofArea, setRoofArea] = useState("85");
  const [climateZone, setClimateZone] = useState("C3");

  const layerManagement = useLayerManagement({
    savedBeforeLayers: savedData?.beforeLayers,
    savedAfterLayers: savedData?.afterLayers,
    floorType
  });

  const thermalSettings = useThermalResistanceSettings({
    savedData,
    surfaceArea,
    roofArea
  });

  const thermalCalculations = useThermalCalculations({
    beforeLayers: layerManagement.beforeLayers,
    afterLayers: layerManagement.afterLayers,
    ventilationBefore: (thermalSettings.ventilationBefore || "caso1") as VentilationType,
    ventilationAfter: (thermalSettings.ventilationAfter || "caso1") as VentilationType,
    ratioBefore: thermalSettings.ratioBefore,
    ratioAfter: thermalSettings.ratioAfter,
    rsiBefore: thermalSettings.rsiBefore,
    rseBefore: thermalSettings.rseBefore,
    rsiAfter: thermalSettings.rsiAfter,
    rseAfter: thermalSettings.rseAfter
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
      } else if (geolocatedClimateZone) {
        console.log('🌍 Utilisation zone géolocalisée:', geolocatedClimateZone);
        setClimateZone(geolocatedClimateZone);
      } else if (realClimateZone) {
        setClimateZone(realClimateZone);
      }
    } else if (geolocatedClimateZone) {
      console.log('🌍 Zone géolocalisée prioritaire:', geolocatedClimateZone);
      setClimateZone(geolocatedClimateZone);
    } else if (realClimateZone) {
      setClimateZone(realClimateZone);
    }
  }, [savedData, realClimateZone, geolocatedClimateZone]);

  // Synchroniser avec la zone géolocalisée quand elle change
  useEffect(() => {
    if (geolocatedClimateZone && geolocatedClimateZone !== climateZone) {
      console.log('🌍 Synchronisation zone géolocalisée:', climateZone, '->', geolocatedClimateZone);
      setClimateZone(geolocatedClimateZone);
    }
  }, [geolocatedClimateZone]);

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
    projectType: "RES010",
    totalRBefore: thermalCalculations.totalRBefore,
    totalRAfter: thermalCalculations.totalRAfter,
    bCoefficientBefore: thermalCalculations.bCoefficientBefore,
    bCoefficientAfter: thermalCalculations.bCoefficientAfter,
    rsiBefore: thermalSettings.rsiBefore,
    rseBefore: thermalSettings.rseBefore,
    rsiAfter: thermalSettings.rsiAfter,
    rseAfter: thermalSettings.rseAfter,
    ventilationBefore: (thermalSettings.ventilationBefore || "caso1") as VentilationType,
    ventilationAfter: (thermalSettings.ventilationAfter || "caso1") as VentilationType,
    ratioBefore: thermalSettings.ratioBefore,
    ratioAfter: thermalSettings.ratioAfter
  }), [
    layerManagement.beforeLayers,
    layerManagement.afterLayers,
    thermalSettings,
    surfaceArea,
    roofArea,
    climateZone,
    thermalCalculations
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
