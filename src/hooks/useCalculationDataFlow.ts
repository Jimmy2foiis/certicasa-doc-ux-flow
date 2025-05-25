
import { useState, useEffect } from "react";
import { useCalculationPersistence } from "./useCalculationPersistence";

interface UseCalculationDataFlowProps {
  clientId: string;
  savedData?: any;
  clientClimateZone?: string;
}

export const useCalculationDataFlow = ({ 
  clientId, 
  savedData, 
  clientClimateZone 
}: UseCalculationDataFlowProps) => {
  const [isRestoringData, setIsRestoringData] = useState(true);
  const [persistedData, setPersistedData] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const { 
    getCalculationState, 
    hasPersistedData 
  } = useCalculationPersistence(clientId);

  // Récupérer les données persistées au démarrage (une seule fois)
  useEffect(() => {
    if (!dataLoaded) {
      const recovered = hasPersistedData() ? getCalculationState() : null;
      console.log('🔄 useCalculationDataFlow - Chargement initial:', {
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

  // Fin de la restauration après le premier rendu avec les données chargées
  useEffect(() => {
    if (dataLoaded && isRestoringData) {
      const timer = setTimeout(() => {
        setIsRestoringData(false);
        console.log('✅ Fin de la restauration des données');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dataLoaded, isRestoringData]);

  // Prepare merged data with persisted data taking priority
  const getMergedData = () => {
    return {
      ...savedData,
      surfaceArea: persistedData?.surfaceArea || savedData?.surfaceArea,
      roofArea: persistedData?.roofArea || savedData?.roofArea,
      projectType: persistedData?.projectType || savedData?.projectType,
      ventilationBefore: persistedData?.ventilationBefore || savedData?.ventilationBefore,
      ventilationAfter: persistedData?.ventilationAfter || savedData?.ventilationAfter,
      rsiBefore: persistedData?.rsiBefore || savedData?.rsiBefore,
      rseBefore: persistedData?.rseBefore || savedData?.rseBefore,
      rsiAfter: persistedData?.rsiAfter || savedData?.rsiAfter,
      rseAfter: persistedData?.rseAfter || savedData?.rseAfter,
      ratioBefore: persistedData?.ratioBefore || savedData?.ratioBefore,
      ratioAfter: persistedData?.ratioAfter || savedData?.ratioAfter,
      climateZone: persistedData?.climateZone || clientClimateZone || savedData?.climateZone,
    };
  };

  return {
    isRestoringData,
    persistedData,
    dataLoaded,
    getMergedData,
  };
};
