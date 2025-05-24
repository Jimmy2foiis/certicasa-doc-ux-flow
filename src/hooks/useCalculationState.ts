
import { useLayerManagement, Layer } from "./useLayerManagement";
import { useProjectSettings } from "./useProjectSettings";
import { useThermalResistanceSettings } from "./useThermalResistanceSettings";
import { useThermalCalculations } from "./useThermalCalculations";
import { Material } from "@/data/materials";
import { VentilationType } from "@/utils/calculationUtils";

export interface CalculationStateProps {
  savedData?: any;
  clientClimateZone?: string;
}

export interface CalculationData {
  beforeLayers: Layer[];
  afterLayers: Layer[];
  projectType: string;
  surfaceArea: string;
  roofArea: string;
  ventilationBefore: VentilationType;
  ventilationAfter: VentilationType;
  ratioBefore: number;
  ratioAfter: number;
  rsiBefore: string;
  rseBefore: string;
  rsiAfter: string;
  rseAfter: string;
  totalRBefore: number;
  upValueBefore: number;
  uValueBefore: number;
  totalRAfter: number;
  upValueAfter: number;
  uValueAfter: number;
  improvementPercent: number;
  climateZone: string;
  bCoefficientBefore: number;
  bCoefficientAfter: number;
  meetsRequirements: boolean;
}

export { Layer };

export const useCalculationState = ({ savedData, clientClimateZone }: CalculationStateProps) => {
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

  // Calculer tous les paramètres requis pour l'export Excel
  const calculationData: CalculationData = {
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
    climateZone: clientClimateZone || "C3",
    bCoefficientBefore,
    bCoefficientAfter,
    meetsRequirements,
  };

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
  };
};
