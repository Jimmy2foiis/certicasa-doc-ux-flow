
import { Layer } from "./useLayerManagement";
import { VentilationType } from "@/utils/calculationUtils";

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

interface UseCalculationDataProps {
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

export const useCalculationData = ({
  beforeLayers,
  afterLayers,
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
}: UseCalculationDataProps): CalculationData => {
  return {
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
  };
};
