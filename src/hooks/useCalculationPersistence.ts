
// src/hooks/useCalculationPersistence.ts
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

  /* ---------- 1. Sauvegarde ---------- */
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

  /* ---------- 2. Lecture (avec fallback) ---------- */
  const getCalculationState = (): CalculationPersistenceData | null => {
    const candidateKeys = [storageKey, 'calculation_state_default'];

    for (const key of candidateKeys) {
      try {
        const saved = localStorage.getItem(key);
        if (!saved) continue;

        const data = JSON.parse(saved);
        if (data && typeof data === 'object') {
          console.log('📂 État des calculs récupéré depuis', key, {
            beforeLayers: data.beforeLayers?.length || 0,
            afterLayers: data.afterLayers?.length || 0,
            timestamp: data.timestamp
          });
          return data;
        }
      } catch (error) {
        console.error(`❌ Erreur récupération état calculs (clé ${key}):`, error);
      }
    }

    console.log('📂 Aucune donnée sauvegardée valide trouvée pour client:', clientId);
    return null;
  };

  /* ---------- 3. Suppression ---------- */
  const clearCalculationState = () => {
    try {
      localStorage.removeItem(storageKey);
      console.log('🗑️ État des calculs effacé pour client:', clientId);
    } catch (error) {
      console.error('❌ Erreur effacement état calculs:', error);
    }
  };

  /* ---------- 4. Existence de données ---------- */
  const hasPersistedData = (): boolean => {
    const saved = getCalculationState();
    const hasData = Boolean(saved);
    console.log('🔍 Vérification données persistées pour client:', clientId, { hasData });
    return hasData;
  };

  return {
    saveCalculationState,
    getCalculationState,
    clearCalculationState,
    hasPersistedData,
    isInitialLoad
  };
};
