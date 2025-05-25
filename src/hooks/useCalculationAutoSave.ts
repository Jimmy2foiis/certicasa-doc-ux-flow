
import { useEffect, useRef } from "react";
import { useCalculationPersistence } from "./useCalculationPersistence";
import { Layer } from "./useLayerManagement";
import { VentilationType } from "@/utils/calculationUtils";
import { useToast } from "@/hooks/use-toast";

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

  // Créer une signature unique des données
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

  // Sauvegarder automatiquement à chaque changement
  useEffect(() => {
    // Ne pas sauvegarder en cours de restauration
    if (!dataLoaded || isRestoringData) {
      return;
    }

    const currentSignature = createDataSignature();
    
    // Éviter les sauvegardes redondantes
    if (currentSignature === lastSaveRef.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
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

        saveCalculationState(dataToSave);
        lastSaveRef.current = currentSignature;

        // Toast de confirmation uniquement pour les modifications utilisateur (pas le premier chargement)
        if (!isFirstSave.current) {
          toast({
            title: "💾 Calcul sauvegardé automatiquement",
            description: `${beforeLayers.length + afterLayers.length} couches • Surface: ${surfaceArea}m²`,
            duration: 2000,
          });
        }
        isFirstSave.current = false;

        console.log('✅ Auto-sauvegarde réussie:', {
          beforeLayersCount: beforeLayers.length,
          afterLayersCount: afterLayers.length,
        });

      } catch (error) {
        console.error('❌ Erreur auto-sauvegarde:', error);
        toast({
          title: "❌ Erreur de sauvegarde automatique",
          description: "Vos modifications n'ont pas pu être sauvegardées",
          variant: "destructive",
          duration: 3000,
        });
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [
    beforeLayers, afterLayers, surfaceArea, roofArea, projectType,
    ventilationBefore, ventilationAfter, ratioBefore, ratioAfter,
    rsiBefore, rseBefore, rsiAfter, rseAfter, climateZone,
    saveCalculationState, isRestoringData, dataLoaded, toast
  ]);
};
