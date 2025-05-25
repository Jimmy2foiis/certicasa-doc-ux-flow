
import { useEffect, useCallback } from 'react';

// Event types for calculation management
export const CALCULATION_EVENTS = {
  CALCULATION_SAVED: 'calculation-saved',
  CALCULATION_UPDATED: 'calculation-updated',
  CALCULATION_DELETED: 'calculation-deleted',
} as const;

// Custom hook for emitting calculation events
export const useCalculationEventEmitter = () => {
  const emitCalculationSaved = useCallback((calculationData: any) => {
    const event = new CustomEvent(CALCULATION_EVENTS.CALCULATION_SAVED, {
      detail: calculationData
    });
    window.dispatchEvent(event);
    
    // Also trigger storage event for cross-tab communication
    const storageEvent = new StorageEvent('storage', {
      key: 'saved_calculations',
      newValue: localStorage.getItem('saved_calculations'),
      storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);
  }, []);

  const emitCalculationUpdated = useCallback((calculationData: any) => {
    const event = new CustomEvent(CALCULATION_EVENTS.CALCULATION_UPDATED, {
      detail: calculationData
    });
    window.dispatchEvent(event);
  }, []);

  const emitCalculationDeleted = useCallback((calculationId: string) => {
    const event = new CustomEvent(CALCULATION_EVENTS.CALCULATION_DELETED, {
      detail: { id: calculationId }
    });
    window.dispatchEvent(event);
  }, []);

  return {
    emitCalculationSaved,
    emitCalculationUpdated,
    emitCalculationDeleted
  };
};

// Custom hook for listening to calculation events
export const useCalculationEventListener = (
  onCalculationSaved?: (data: any) => void,
  onCalculationUpdated?: (data: any) => void,
  onCalculationDeleted?: (id: string) => void
) => {
  useEffect(() => {
    const handleCalculationSaved = (event: CustomEvent) => {
      if (onCalculationSaved) {
        onCalculationSaved(event.detail);
      }
    };

    const handleCalculationUpdated = (event: CustomEvent) => {
      if (onCalculationUpdated) {
        onCalculationUpdated(event.detail);
      }
    };

    const handleCalculationDeleted = (event: CustomEvent) => {
      if (onCalculationDeleted) {
        onCalculationDeleted(event.detail.id);
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'saved_calculations' && onCalculationSaved) {
        // Refresh calculations when storage changes
        onCalculationSaved(null);
      }
    };

    window.addEventListener(CALCULATION_EVENTS.CALCULATION_SAVED, handleCalculationSaved as EventListener);
    window.addEventListener(CALCULATION_EVENTS.CALCULATION_UPDATED, handleCalculationUpdated as EventListener);
    window.addEventListener(CALCULATION_EVENTS.CALCULATION_DELETED, handleCalculationDeleted as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(CALCULATION_EVENTS.CALCULATION_SAVED, handleCalculationSaved as EventListener);
      window.removeEventListener(CALCULATION_EVENTS.CALCULATION_UPDATED, handleCalculationUpdated as EventListener);
      window.removeEventListener(CALCULATION_EVENTS.CALCULATION_DELETED, handleCalculationDeleted as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onCalculationSaved, onCalculationUpdated, onCalculationDeleted]);
};
