
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

  useEffect(() => {
    if (savedData) {
      if (savedData.ratioBefore) setRatioBefore(savedData.ratioBefore);
      if (savedData.ratioAfter) setRatioAfter(savedData.ratioAfter);
      if (savedData.rsiBefore) setRsiBefore(savedData.rsiBefore);
      if (savedData.rseBefore) setRseBefore(savedData.rseBefore);
      if (savedData.rsiAfter) setRsiAfter(savedData.rsiAfter);
      if (savedData.rseAfter) setRseAfter(savedData.rseAfter);
    }
  }, [savedData]);

  // Calculate ratios automatically when surface areas change
  useEffect(() => {
    const comblesArea = parseFloat(surfaceArea);
    const toitureArea = parseFloat(roofArea);

    if (!isNaN(comblesArea) && !isNaN(toitureArea) && toitureArea > 0) {
      const calculatedRatio = calculateRatioFromAreas(comblesArea, toitureArea);
      setRatioBefore(calculatedRatio);
      setRatioAfter(calculatedRatio);
    }
  }, [surfaceArea, roofArea]);

  const copyBeforeToAfter = () => {
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
