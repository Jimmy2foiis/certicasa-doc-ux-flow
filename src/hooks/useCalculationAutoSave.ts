
import { useEffect, useRef } from "react";
import { useCalculationPersistence } from "./useCalculationPersistence";
import { Layer } from "./useLayerManagement";
import { VentilationType } from "@/utils/calculationUtils";
import { useToast } from "@/hooks/use-toast";
import { calculationPersistenceService } from "@/services/calculationPersistenceService";

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
  const { toast } = useToast();
  const lastSaveRef = useRef<string>("");
  const isFirstSave = useRef(true);
  const saveInProgress = useRef(false);

  // Créer une signature unique des données
  const createDataSignature = () => {
    return JSON.stringify({
      beforeLayers: beforeLayers.map(l => `${l.id}-${l.thickness}-${l.lambda}`),
      afterLayers: afterLayers.map(l => `${l.id}-${l.thickness}-${l.lambda}`),
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

  // Sauvegarder automatiquement avec délai augmenté
  useEffect(() => {
    // Ne pas sauvegarder en cours de restauration ou si une sauvegarde est en cours
    if (!dataLoaded || isRestoringData || saveInProgress.current) {
      return;
    }

    const currentSignature = createDataSignature();
    
    // Éviter les sauvegardes redondantes
    if (currentSignature === lastSaveRef.current) {
      return;
    }

    console.log('🔄 Programmation auto-save dans 3 secondes...');

    const timeoutId = setTimeout(async () => {
      try {
        saveInProgress.current = true;
        
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

        const success = await saveCalculationState(dataToSave);
        
        if (success) {
          lastSaveRef.current = currentSignature;

          // Toast de confirmation uniquement pour les modifications utilisateur
          if (!isFirstSave.current) {
            toast({
              title: "💾 Calcul sauvegardé",
              description: `${beforeLayers.length + afterLayers.length} couches • Surface: ${surfaceArea}m²`,
              duration: 2000,
            });
          }
          isFirstSave.current = false;

          // Marquer pour future synchronisation BDD
          calculationPersistenceService.markForDatabaseSync(clientId, {
            ...dataToSave,
            timestamp: new Date().toISOString(),
            sessionId: `session_${Date.now()}`
          } as any);

          console.log('✅ Auto-sauvegarde réussie (service isolé):', {
            beforeLayersCount: beforeLayers.length,
            afterLayersCount: afterLayers.length,
          });
        } else {
          console.warn('⚠️ Échec auto-sauvegarde, retry programmé...');
        }

      } catch (error) {
        console.error('❌ Erreur auto-sauvegarde:', error);
        toast({
          title: "❌ Erreur de sauvegarde",
          description: "Vos modifications n'ont pas pu être sauvegardées",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        saveInProgress.current = false;
      }
    }, 3000); // Délai augmenté à 3 secondes

    return () => {
      clearTimeout(timeoutId);
      saveInProgress.current = false;
    };
  }, [
    beforeLayers, afterLayers, surfaceArea, roofArea, projectType,
    ventilationBefore, ventilationAfter, ratioBefore, ratioAfter,
    rsiBefore, rseBefore, rsiAfter, rseAfter, climateZone,
    saveCalculationState, isRestoringData, dataLoaded, toast, clientId
  ]);
};
