
import { useRef } from 'react';
import { Layer } from './useLayerManagement';

interface CalculationPersistenceData {
  beforeLayers: Layer[];
  afterLayers: Layer[];
  surfaceArea: string;
  roofArea: string;
  projectType: string;
  ventilationBefore: string;
  ventilationAfter: string;
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
  const storageKey = `calculation_state_${clientId}`;
  const isInitialLoad = useRef(true);

  // Sauvegarde simplifiée
  const saveCalculationState = (data: Partial<CalculationPersistenceData>) => {
    try {
      const existing = getCalculationState();
      const updated = {
        ...existing,
        ...data,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(updated));
      console.log('💾 État sauvegardé:', clientId, {
        beforeLayers: updated.beforeLayers?.length || 0,
        afterLayers: updated.afterLayers?.length || 0
      });
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      return false;
    }
  };

  // Lecture avec fallback
  const getCalculationState = (): CalculationPersistenceData | null => {
    const candidateKeys = [storageKey, 'calculation_state_default'];

    for (const key of candidateKeys) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const data = JSON.parse(saved);
          if (data && typeof data === 'object') {
            console.log('📂 Données récupérées depuis', key);
            return data;
          }
        }
      } catch (error) {
        console.error(`❌ Erreur lecture ${key}:`, error);
      }
    }

    return null;
  };

  // Suppression
  const clearCalculationState = () => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem('calculation_state_default');
      console.log('🗑️ Cache effacé pour:', clientId);
      return true;
    } catch (error) {
      console.error('❌ Erreur effacement:', error);
      return false;
    }
  };

  // Test d'existence simplifié
  const hasPersistedData = (): boolean => {
    const data = getCalculationState();
    return Boolean(data);
  };

  return {
    saveCalculationState,
    getCalculationState,
    clearCalculationState,
    hasPersistedData,
    isInitialLoad
  };
};
