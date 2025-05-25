
/**
 * Service de persistance isolé pour les calculs
 * Indépendant des re-rendus React et des mises à jour clients
 */

import { Layer } from "@/hooks/useLayerManagement";
import { VentilationType } from "@/utils/calculationUtils";

interface CalculationState {
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
  sessionId: string;
}

class CalculationPersistenceService {
  private saveQueue: CalculationState[] = [];
  private saveLock = false;
  private debounceTimer: NodeJS.Timeout | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    console.log('📊 Service de persistance des calculs initialisé:', this.sessionId);
  }

  private generateSessionId(): string {
    return `calc_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getStorageKey(clientId: string): string {
    return `calculation_state_${clientId}_${this.sessionId}`;
  }

  /**
   * Sauvegarde avec debouncing intelligent et verrou
   */
  public saveCalculationState(clientId: string, data: Partial<CalculationState>): Promise<boolean> {
    return new Promise((resolve) => {
      // Annuler la sauvegarde précédente en attente
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // Programmer une nouvelle sauvegarde
      this.debounceTimer = setTimeout(async () => {
        if (this.saveLock) {
          console.log('🔒 Sauvegarde en cours, mise en queue...');
          this.saveQueue.push(data as CalculationState);
          resolve(false);
          return;
        }

        try {
          this.saveLock = true;
          const success = await this.performSave(clientId, data);
          
          // Traiter la queue
          await this.processQueue(clientId);
          
          resolve(success);
        } catch (error) {
          console.error('❌ Erreur sauvegarde:', error);
          resolve(false);
        } finally {
          this.saveLock = false;
        }
      }, 2500); // Délai augmenté à 2.5 secondes
    });
  }

  private async performSave(clientId: string, data: Partial<CalculationState>): Promise<boolean> {
    try {
      const storageKey = this.getStorageKey(clientId);
      const existing = this.getCalculationState(clientId);
      
      const updated = {
        ...existing,
        ...data,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      };

      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      console.log('💾 Calcul sauvegardé (service isolé):', {
        clientId,
        sessionId: this.sessionId,
        beforeLayers: updated.beforeLayers?.length || 0,
        afterLayers: updated.afterLayers?.length || 0
      });

      return true;
    } catch (error) {
      console.error('❌ Erreur performSave:', error);
      return false;
    }
  }

  private async processQueue(clientId: string): Promise<void> {
    if (this.saveQueue.length === 0) return;

    console.log(`📦 Traitement de ${this.saveQueue.length} sauvegardes en queue...`);
    
    // Prendre seulement la dernière sauvegarde (la plus récente)
    const latestSave = this.saveQueue[this.saveQueue.length - 1];
    this.saveQueue = [];

    await this.performSave(clientId, latestSave);
  }

  /**
   * Récupération avec fallback
   */
  public getCalculationState(clientId: string): CalculationState | null {
    const candidateKeys = [
      this.getStorageKey(clientId),
      `calculation_state_${clientId}`,
      'calculation_state_default'
    ];

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
  }

  /**
   * Suppression avec nettoyage
   */
  public clearCalculationState(clientId: string): boolean {
    try {
      const keys = [
        this.getStorageKey(clientId),
        `calculation_state_${clientId}`,
        'calculation_state_default'
      ];

      keys.forEach(key => localStorage.removeItem(key));
      
      // Vider la queue
      this.saveQueue = [];
      
      console.log('🗑️ Cache effacé pour:', clientId);
      return true;
    } catch (error) {
      console.error('❌ Erreur effacement:', error);
      return false;
    }
  }

  /**
   * Vérification d'existence
   */
  public hasPersistedData(clientId: string): boolean {
    return Boolean(this.getCalculationState(clientId));
  }

  /**
   * Préparation pour future synchronisation BDD
   */
  public markForDatabaseSync(clientId: string, calculationData: CalculationState): void {
    // TODO: Implémenter la queue pour la synchronisation BDD future
    const syncKey = `sync_queue_${clientId}`;
    try {
      const existing = localStorage.getItem(syncKey);
      const queue = existing ? JSON.parse(existing) : [];
      
      queue.push({
        ...calculationData,
        syncPending: true,
        syncAttempts: 0,
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem(syncKey, JSON.stringify(queue));
      console.log('📋 Marqué pour synchronisation BDD future:', clientId);
    } catch (error) {
      console.error('❌ Erreur marquage sync:', error);
    }
  }
}

// Instance singleton
export const calculationPersistenceService = new CalculationPersistenceService();
