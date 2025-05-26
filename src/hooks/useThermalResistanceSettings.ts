
import { useState, useEffect } from "react";
import { calculateRatioFromAreas } from "@/utils/calculationUtils";

interface UseThermalResistanceSettingsProps {
  savedData?: any;
  surfaceArea: string;
  roofArea: string;
}

export const useThermalResistanceSettings = ({ 
  savedData, 
  surfaceArea, 
  roofArea 
}: UseThermalResistanceSettingsProps) => {
  const [ratioBefore, setRatioBefore] = useState(0.85);
  const [ratioAfter, setRatioAfter] = useState(0.85);
  const [rsiBefore, setRsiBefore] = useState("0.10");
  const [rseBefore, setRseBefore] = useState("0.10");
  const [rsiAfter, setRsiAfter] = useState("0.10");
  const [rseAfter, setRseAfter] = useState("0.10");

  // Charger les données sauvegardées une seule fois
  useEffect(() => {
    if (savedData) {
      console.log('🔄 Chargement données thermiques sauvegardées:', savedData);
      if (savedData.rsiBefore) setRsiBefore(savedData.rsiBefore);
      if (savedData.rseBefore) setRseBefore(savedData.rseBefore);
      if (savedData.rsiAfter) setRsiAfter(savedData.rsiAfter);
      if (savedData.rseAfter) setRseAfter(savedData.rseAfter);
      // Ne pas charger les ratios sauvegardés car ils doivent être recalculés
    }
  }, [savedData]);

  // Recalculer automatiquement les ratios quand les surfaces changent
  useEffect(() => {
    const comblesArea = parseFloat(surfaceArea);
    const toitureArea = parseFloat(roofArea);

    console.log('📐 Recalcul ratio - Combles:', comblesArea, 'm² - Toiture:', toitureArea, 'm²');

    if (!isNaN(comblesArea) && !isNaN(toitureArea) && toitureArea > 0) {
      const calculatedRatio = calculateRatioFromAreas(comblesArea, toitureArea);
      console.log('📐 Nouveau ratio calculé:', calculatedRatio);
      
      setRatioBefore(calculatedRatio);
      setRatioAfter(calculatedRatio);
    } else {
      console.log('⚠️ Surfaces invalides - ratio par défaut: 0.85');
      setRatioBefore(0.85);
      setRatioAfter(0.85);
    }
  }, [surfaceArea, roofArea]);

  const copyBeforeToAfter = () => {
    console.log('📋 Copie paramètres thermiques AVANT vers APRÈS');
    setRatioAfter(ratioBefore);
    setRsiAfter(rsiBefore);
    setRseAfter(rseBefore);
  };

  return {
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
    copyBeforeToAfter,
  };
};
