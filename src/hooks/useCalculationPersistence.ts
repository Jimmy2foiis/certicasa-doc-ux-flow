
import { useEffect, useRef } from 'react';
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

  // Sauvegarder l'état dans localStorage
  const saveCalculationState = (data: Partial<CalculationPersistenceData>) => {
    try {
      const existing = getCalculationState();
      const updated = {
        ...existing,
        ...data,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updated));
      console.log('💾 État des calculs sauvegardé pour client:', clientId, {
        beforeLayersCount: updated.beforeLayers?.length || 0,
        afterLayersCount: updated.afterLayers?.length || 0
      });
    } catch (error) {
      console.error('❌ Erreur sauvegarde état calculs:', error);
    }
  };

  // Récupérer l'état depuis localStorage
  const getCalculationState = (): CalculationPersistenceData | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        console.log('📂 État des calculs récupéré pour client:', clientId, {
          beforeLayersCount: data.beforeLayers?.length || 0,
          afterLayersCount: data.afterLayers?.length || 0,
          timestamp: data.timestamp
        });
        return data;
      }
      return null;
    } catch (error) {
      console.error('❌ Erreur récupération état calculs:', error);
      return null;
    }
  };

  // Effacer l'état sauvegardé
  const clearCalculationState = () => {
    try {
      localStorage.removeItem(storageKey);
      console.log('🗑️ État des calculs effacé pour client:', clientId);
    } catch (error) {
      console.error('❌ Erreur effacement état calculs:', error);
    }
  };

  // Vérifier si des données sont sauvegardées
  const hasPersistedData = (): boolean => {
    const saved = getCalculationState();
    return saved !== null && saved.timestamp !== undefined;
  };

  return {
    saveCalculationState,
    getCalculationState,
    clearCalculationState,
    hasPersistedData,
    isInitialLoad
  };
};
