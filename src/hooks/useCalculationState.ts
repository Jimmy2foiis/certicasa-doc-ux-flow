
import { useLayerManagement, Layer } from "./useLayerManagement";
import { useProjectSettings } from "./useProjectSettings";
import { useThermalResistanceSettings } from "./useThermalResistanceSettings";
import { useThermalCalculations } from "./useThermalCalculations";
import { useClimateZoneState } from "./useClimateZoneState";
import { useCalculationData, CalculationData } from "./useCalculationData";
import { VentilationType } from "@/utils/calculationUtils";

export interface CalculationStateProps {
  savedData?: any;
  clientClimateZone?: string;
  floorType?: string;
}

export type { CalculationData, Layer };

export const useCalculationState = ({ savedData, clientClimateZone, floorType }: CalculationStateProps) => {
  // Climate zone management
  const { climateZone, setClimateZone } = useClimateZoneState({ clientClimateZone });

  // Layer management
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
    savedBeforeLayers: savedData?.beforeLayers,
    savedAfterLayers: savedData?.afterLayers,
    floorType: floorType
  });

  // Project settings
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
  } = useProjectSettings({ savedData });

  // Thermal resistance settings
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
    savedData,
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

  // Combined copy function
  const copyBeforeToAfter = () => {
    copyLayersBeforeToAfter();
    copyThermalBeforeToAfter();
  };

  // Aggregate calculation data - LOG des couches au moment de l'agrégation
  console.log('📊 useCalculationState - Agrégation calculationData:', {
    beforeLayersCount: beforeLayers.length,
    afterLayersCount: afterLayers.length,
    beforeLayersThickness: beforeLayers.map(l => `${l.name}: ${l.thickness}mm`),
    afterLayersThickness: afterLayers.map(l => `${l.name}: ${l.thickness}mm`)
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
  };
};
