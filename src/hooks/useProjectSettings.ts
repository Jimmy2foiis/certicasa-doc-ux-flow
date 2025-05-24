
import { useState, useEffect } from "react";
import { VentilationType, calculateRatioFromAreas } from "@/utils/calculationUtils";

interface UseProjectSettingsProps {
  savedData?: any;
}

export const useProjectSettings = ({ savedData }: UseProjectSettingsProps) => {
  const [projectType, setProjectType] = useState("RES010");
  const [surfaceArea, setSurfaceArea] = useState("127");
  const [roofArea, setRoofArea] = useState("150");
  const [ventilationBefore, setVentilationBefore] = useState<VentilationType>("caso1");
  const [ventilationAfter, setVentilationAfter] = useState<VentilationType>("caso1");

  useEffect(() => {
    if (savedData) {
      if (savedData.projectType) setProjectType(savedData.projectType);
      if (savedData.surfaceArea) setSurfaceArea(savedData.surfaceArea);
      if (savedData.roofArea) setRoofArea(savedData.roofArea);
      if (savedData.ventilationBefore) setVentilationBefore(savedData.ventilationBefore);
      if (savedData.ventilationAfter) setVentilationAfter(savedData.ventilationAfter);
    }
  }, [savedData]);

  return {
    projectType,
    setProjectType,
    surfaceArea,
    setSurfaceArea,
    roofArea,
    setRoofArea,
    ventilationBefore,
    setVentilationBefore,
    ventilationAfter,
    setVentilationAfter,
  };
};
