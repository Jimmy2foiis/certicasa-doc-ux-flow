
import { useLayerManagement, Layer } from "./useLayerManagement";
import { useProjectSettings } from "./useProjectSettings";
import { useThermalResistanceSettings } from "./useThermalResistanceSettings";
import { useThermalCalculations } from "./useThermalCalculations";
import { useClimateZoneState } from "./useClimateZoneState";
import { useCalculationData, CalculationData } from "./useCalculationData";
import { useCalculationDataFlow } from "./useCalculationDataFlow";
import { useCalculationAutoSave } from "./useCalculationAutoSave";

export interface CalculationStateProps {
  savedData?: any;
  clientClimateZone?: string;
  floorType?: string;
}

export type { CalculationData, Layer };

export const useCalculationStateManager = ({ savedData, clientClimateZone, floorType }: CalculationStateProps) => {
  const clientId = savedData?.clientId || 'default';
  
  // Data flow management
  const { 
    isRestoringData,
    persistedData,
    dataLoaded,
    getMergedData
  } = useCalculationDataFlow({ clientId, savedData, clientClimateZone });

  // Climate zone management
  const { climateZone, setClimateZone } = useClimateZoneState({ clientClimateZone });

  const mergedData = getMergedData();

  // Layer management avec données persistées en priorité
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

  // Project settings avec données persistées en priorité
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
  } = useProjectSettings({ savedData: mergedData });

  // Thermal resistance settings avec données persistées en priorité
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
    savedData: mergedData,
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

  // Auto-save management
  useCalculationAutoSave({
    clientId,
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
    isRestoringData,
    dataLoaded,
  });

  // Combined copy function
  const copyBeforeToAfter = () => {
    copyLayersBeforeToAfter();
    copyThermalBeforeToAfter();
  };

  // LOG des couches au moment de l'agrégation
  console.log('📊 useCalculationStateManager - Agrégation calculationData:', {
    beforeLayersCount: beforeLayers.length,
    afterLayersCount: afterLayers.length,
    beforeLayersThickness: beforeLayers.map(l => `${l.name}: ${l.thickness}mm`),
    afterLayersThickness: afterLayers.map(l => `${l.name}: ${l.thickness}mm`),
    persistenceActive: !isRestoringData && dataLoaded,
    dataLoaded
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
