
import {
  calculateBCoefficient,
  calculateThermalResistance,
  calculateUpValue,
  calculateUfValue,
  VentilationType,
} from "@/utils/calculationUtils";
import { Layer } from "./useLayerManagement";

interface UseThermalCalculationsProps {
  beforeLayers: Layer[];
  afterLayers: Layer[];
  ventilationBefore: VentilationType;
  ventilationAfter: VentilationType;
  ratioBefore: number;
  ratioAfter: number;
  rsiBefore: string;
  rseBefore: string;
  rsiAfter: string;
  rseAfter: string;
}

export const useThermalCalculations = ({
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
}: UseThermalCalculationsProps) => {
  // Calcul du coefficient B avant
  const bCoefficientBefore = calculateBCoefficient({
    ratio: ratioBefore,
    ventilationType: ventilationBefore,
    isAfterWork: false,
  });

  // Calcul du coefficient B après
  const bCoefficientAfter = calculateBCoefficient({
    ratio: ratioAfter,
    ventilationType: ventilationAfter,
    isAfterWork: true,
  });

  const rsiRseBeforeValue = parseFloat(rsiBefore) + parseFloat(rseBefore);
  const rsiRseBeforeFallback = isNaN(rsiRseBeforeValue) ? 0.17 : rsiRseBeforeValue;

  const rsiRseAfterValue = parseFloat(rsiAfter) + parseFloat(rseAfter);
  const rsiRseAfterFallback = isNaN(rsiRseAfterValue) ? 0.17 : rsiRseAfterValue;

  // Calcul de la résistance thermique totale avant
  const totalRBefore = calculateThermalResistance(beforeLayers, rsiRseBeforeFallback);
  const upValueBefore = calculateUpValue(totalRBefore);
  const uValueBefore = calculateUfValue(upValueBefore, bCoefficientBefore);

  // Calcul de la résistance thermique totale après
  const totalRAfter = calculateThermalResistance(afterLayers, rsiRseAfterFallback);
  const upValueAfter = calculateUpValue(totalRAfter);
  const uValueAfter = calculateUfValue(upValueAfter, bCoefficientAfter);

  // Calcul du pourcentage d'amélioration
  const improvementPercent = ((uValueBefore - uValueAfter) / uValueBefore) * 100;

  // Déterminer si les exigences sont satisfaites
  const meetsRequirements = improvementPercent >= 30;

  return {
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
  };
};
