
import { useEffect, useRef } from "react";
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
  const lastSaveRef = useRef<string>("");

  // Créer une signature unique des données pour éviter les sauvegardes inutiles
  const createDataSignature = () => {
    return JSON.stringify({
      beforeLayers: beforeLayers.map(l => `${l.id}-${l.thickness}`),
      afterLayers: afterLayers.map(l => `${l.id}-${l.thickness}`),
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
  };

  // Sauvegarder automatiquement l'état à chaque changement (après le chargement initial)
  useEffect(() => {
    // Ne pas sauvegarder si on est en train de restaurer ou si les données ne sont pas chargées
    if (!dataLoaded || isRestoringData) {
      console.log('⏸️ Sauvegarde ignorée - restauration en cours ou données non chargées', {
        dataLoaded,
        isRestoringData
      });
      return;
    }

    const currentSignature = createDataSignature();
    
    // Éviter les sauvegardes redondantes
    if (currentSignature === lastSaveRef.current) {
      console.log('⏸️ Sauvegarde ignorée - données identiques');
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
        afterLayersThickness: afterLayers.map(l => `${l.name}: ${l.thickness}mm`),
        signature: currentSignature.substring(0, 50) + '...'
      });

      saveCalculationState(dataToSave);
      lastSaveRef.current = currentSignature;
    }, 1000); // Augmenté à 1 seconde pour éviter trop de sauvegardes

    return () => clearTimeout(timeoutId);
  }, [
    beforeLayers, afterLayers, surfaceArea, roofArea, projectType,
    ventilationBefore, ventilationAfter, ratioBefore, ratioAfter,
    rsiBefore, rseBefore, rsiAfter, rseAfter, climateZone,
    saveCalculationState, isRestoringData, dataLoaded
  ]);
};
