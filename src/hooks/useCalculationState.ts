
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

  // Récupérer les données persistées au démarrage (une seule fois)
  const [persistedData, setPersistedData] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!dataLoaded) {
      const recovered = hasPersistedData() ? getCalculationState() : null;
      console.log('🔄 useCalculationState - Chargement initial:', {
        clientId,
        hasPersistedData: !!recovered,
        persistedBeforeLayers: recovered?.beforeLayers?.length || 0,
        persistedAfterLayers: recovered?.afterLayers?.length || 0,
        savedDataProvided: !!savedData
      });
      setPersistedData(recovered);
      setDataLoaded(true);
    }
  }, [clientId, hasPersistedData, getCalculationState, savedData, dataLoaded]);

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

  // Sauvegarder automatiquement l'état à chaque changement (après le chargement initial)
  useEffect(() => {
    if (!dataLoaded || isRestoringData) {
      if (dataLoaded && isRestoringData) {
        // Fin de la restauration après le premier rendu avec les données chargées
        const timer = setTimeout(() => {
          setIsRestoringData(false);
          console.log('✅ Fin de la restauration des données');
        }, 1000);
        return () => clearTimeout(timer);
      }
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
