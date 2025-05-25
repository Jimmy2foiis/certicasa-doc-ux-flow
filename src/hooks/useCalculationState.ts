
import { useLayerManagement, Layer } from "./useLayerManagement";
import { useProjectSettings } from "./useProjectSettings";
import { useThermalResistanceSettings } from "./useThermalResistanceSettings";
import { useThermalCalculations } from "./useThermalCalculations";
import { useClimateZoneState } from "./useClimateZoneState";
import { useCalculationData, CalculationData } from "./useCalculationData";
import { useCalculationPersistence } from "./useCalculationPersistence";
import { VentilationType } from "@/utils/calculationUtils";
import { useEffect, useState } from "react";

export interface CalculationStateProps {
  savedData?: any;
  clientClimateZone?: string;
  floorType?: string;
}

export type { CalculationData, Layer };

export const useCalculationState = ({ savedData, clientClimateZone, floorType }: CalculationStateProps) => {
  const clientId = savedData?.clientId || 'default';
  const [isRestoringData, setIsRestoringData] = useState(true);
  
  // Système de persistance
  const { 
    saveCalculationState, 
    getCalculationState, 
    hasPersistedData 
  } = useCalculationPersistence(clientId);

  // Climate zone management
  const { climateZone, setClimateZone } = useClimateZoneState({ clientClimateZone });

  // Récupérer les données persistées au démarrage
  const persistedData = hasPersistedData() ? getCalculationState() : null;
  
  console.log('🔄 useCalculationState - Initialisation:', {
    clientId,
    hasPersistedData: !!persistedData,
    persistedBeforeLayers: persistedData?.beforeLayers?.length || 0,
    persistedAfterLayers: persistedData?.afterLayers?.length || 0,
    savedDataProvided: !!savedData
  });

  // Layer management avec données persistées
  const {
    beforeLayers,
    setBeforeLayers,
    afterLayers,
    setAfterLayers,
    addLayer,
    addSouflr47,
    copyBeforeToAfter: copyLayersBeforeToAfter,
    updateLayer,
  } = useLayerManagement({
    savedBeforeLayers: persistedData?.beforeLayers || savedData?.beforeLayers,
    savedAfterLayers: persistedData?.afterLayers || savedData?.afterLayers,
    floorType: floorType
  });

  // Project settings avec données persistées
  const {
    projectType,
    setProjectType,
    surfaceArea,
    setSurfaceArea,
    roofArea,
    setRoofArea,
    ventilationBefore,
    setVentilationBefore,
    ventilationAfter,
    setVentilationAfter,
  } = useProjectSettings({ 
    savedData: {
      ...savedData,
      surfaceArea: persistedData?.surfaceArea || savedData?.surfaceArea,
      roofArea: persistedData?.roofArea || savedData?.roofArea,
      projectType: persistedData?.projectType || savedData?.projectType,
      ventilationBefore: persistedData?.ventilationBefore || savedData?.ventilationBefore,
      ventilationAfter: persistedData?.ventilationAfter || savedData?.ventilationAfter,
    }
  });

  // Thermal resistance settings avec données persistées
  const {
    ratioBefore,
    setRatioBefore,
    ratioAfter,
    setRatioAfter,
    rsiBefore,
    setRsiBefore,
    rseBefore,
    setRseBefore,
    rsiAfter,
    setRsiAfter,
    rseAfter,
    setRseAfter,
    copyBeforeToAfter: copyThermalBeforeToAfter,
  } = useThermalResistanceSettings({
    savedData: {
      ...savedData,
      rsiBefore: persistedData?.rsiBefore || savedData?.rsiBefore,
      rseBefore: persistedData?.rseBefore || savedData?.rseBefore,
      rsiAfter: persistedData?.rsiAfter || savedData?.rsiAfter,
      rseAfter: persistedData?.rseAfter || savedData?.rseAfter,
      ratioBefore: persistedData?.ratioBefore || savedData?.ratioBefore,
      ratioAfter: persistedData?.ratioAfter || savedData?.ratioAfter,
    },
    surfaceArea,
    roofArea,
  });

  // Thermal calculations
  const {
    bCoefficientBefore,
    bCoefficientAfter,
    totalRBefore,
    upValueBefore,
    uValueBefore,
    totalRAfter,
    upValueAfter,
    uValueAfter,
    improvementPercent,
    meetsRequirements,
  } = useThermalCalculations({
    beforeLayers,
    afterLayers,
    ventilationBefore,
    ventilationAfter,
    ratioBefore,
    ratioAfter,
    rsiBefore,
    rseBefore,
    rsiAfter,
    rseAfter,
  });

  // Sauvegarder automatiquement l'état à chaque changement
  useEffect(() => {
    if (isRestoringData) {
      setIsRestoringData(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      saveCalculationState({
        beforeLayers,
        afterLayers,
        surfaceArea,
        roofArea,
        projectType,
        ventilationBefore,
        ventilationAfter,
        ratioBefore,
        ratioAfter,
        rsiBefore,
        rseBefore,
        rsiAfter,
        rseAfter,
        climateZone,
      });
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [
    beforeLayers, afterLayers, surfaceArea, roofArea, projectType,
    ventilationBefore, ventilationAfter, ratioBefore, ratioAfter,
    rsiBefore, rseBefore, rsiAfter, rseAfter, climateZone,
    saveCalculationState, isRestoringData
  ]);

  // Combined copy function
  const copyBeforeToAfter = () => {
    copyLayersBeforeToAfter();
    copyThermalBeforeToAfter();
  };

  // LOG des couches au moment de l'agrégation
  console.log('📊 useCalculationState - Agrégation calculationData:', {
    beforeLayersCount: beforeLayers.length,
    afterLayersCount: afterLayers.length,
    beforeLayersThickness: beforeLayers.map(l => `${l.name}: ${l.thickness}mm`),
    afterLayersThickness: afterLayers.map(l => `${l.name}: ${l.thickness}mm`),
    persistenceActive: !isRestoringData
  });

  const calculationData = useCalculationData({
    projectType,
    surfaceArea,
    roofArea,
    ventilationBefore,
    ventilationAfter,
    ratioBefore,
    ratioAfter,
    rsiBefore,
    rseBefore,
    rsiAfter,
    rseAfter,
    beforeLayers,
    afterLayers,
    totalRBefore,
    upValueBefore,
    uValueBefore,
    totalRAfter,
    upValueAfter,
    uValueAfter,
    improvementPercent,
    climateZone,
    bCoefficientBefore,
    bCoefficientAfter,
    meetsRequirements,
  });

  return {
    beforeLayers,
    setBeforeLayers,
    afterLayers,
    setAfterLayers,
    projectType,
    setProjectType,
    surfaceArea,
    setSurfaceArea,
    roofArea,
    setRoofArea,
    ventilationBefore,
    setVentilationBefore,
    ventilationAfter,
    setVentilationAfter,
    ratioBefore,
    setRatioBefore,
    ratioAfter,
    setRatioAfter,
    rsiBefore,
    setRsiBefore,
    rseBefore,
    setRseBefore,
    rsiAfter,
    setRsiAfter,
    rseAfter,
    setRseAfter,
    totalRBefore,
    upValueBefore,
    uValueBefore,
    totalRAfter,
    upValueAfter,
    uValueAfter,
    improvementPercent,
    bCoefficientBefore,
    bCoefficientAfter,
    meetsRequirements,
    addLayer,
    addSouflr47,
    copyBeforeToAfter,
    updateLayer,
    calculationData,
    climateZone,
    setClimateZone,
    isRestoringData,
  };
};
