
import { useRef } from 'react';
import { Layer } from './useLayerManagement';
import { VentilationType } from '@/utils/calculationUtils';
import { calculationPersistenceService } from '@/services/calculationPersistenceService';

interface CalculationPersistenceData {
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
  timestamp: string;
}

export const useCalculationPersistence = (clientId: string) => {
  const isInitialLoad = useRef(true);

  // Sauvegarde via le service isolé
  const saveCalculationState = async (data: Partial<CalculationPersistenceData>): Promise<boolean> => {
    try {
      const success = await calculationPersistenceService.saveCalculationState(clientId, data);
      
      if (success) {
        console.log('💾 État sauvegardé via service isolé:', clientId);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erreur sauvegarde via service:', error);
      return false;
    }
  };

  // Lecture via le service isolé
  const getCalculationState = (): CalculationPersistenceData | null => {
    return calculationPersistenceService.getCalculationState(clientId);
  };

  // Suppression via le service isolé
  const clearCalculationState = (): boolean => {
    return calculationPersistenceService.clearCalculationState(clientId);
  };

  // Test d'existence via le service isolé
  const hasPersistedData = (): boolean => {
    return calculationPersistenceService.hasPersistedData(clientId);
  };

  return {
    saveCalculationState,
    getCalculationState,
    clearCalculationState,
    hasPersistedData,
    isInitialLoad
  };
};
