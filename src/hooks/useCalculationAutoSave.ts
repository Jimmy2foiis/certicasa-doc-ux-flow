
import { useEffect } from "react";
import { useCalculationPersistence } from "./useCalculationPersistence";
import { Layer } from "./useLayerManagement";
import { VentilationType } from "@/utils/calculationUtils";

interface UseCalculationAutoSaveProps {
  clientId: string;
  beforeLayers: Layer[];
  afterLayers: Layer[];
  surfaceArea: string;
  roofArea: string;
  projectType: string;
  ventilationBefore: VentilationType;
  ventilationAfter: VentilationType;
  ratioBefore: number;
  ratioAfter: number;
  rsiBefore: string;
  rseBefore: string;
  rsiAfter: string;
  rseAfter: string;
  climateZone: string;
  isRestoringData: boolean;
  dataLoaded: boolean;
}

export const useCalculationAutoSave = ({
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
}: UseCalculationAutoSaveProps) => {
  const { saveCalculationState } = useCalculationPersistence(clientId);

  // Sauvegarder automatiquement l'état à chaque changement (après le chargement initial)
  useEffect(() => {
    if (!dataLoaded || isRestoringData) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const dataToSave = {
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
      };

      console.log('💾 Sauvegarde automatique déclenchée:', {
        beforeLayersCount: beforeLayers.length,
        afterLayersCount: afterLayers.length,
        beforeLayersThickness: beforeLayers.map(l => `${l.name}: ${l.thickness}mm`),
        afterLayersThickness: afterLayers.map(l => `${l.name}: ${l.thickness}mm`)
      });

      saveCalculationState(dataToSave);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [
    beforeLayers, afterLayers, surfaceArea, roofArea, projectType,
    ventilationBefore, ventilationAfter, ratioBefore, ratioAfter,
    rsiBefore, rseBefore, rsiAfter, rseAfter, climateZone,
    saveCalculationState, isRestoringData, dataLoaded
  ]);
};
