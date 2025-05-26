
import { useState, useEffect } from "react";
import { VentilationType } from "@/utils/calculationUtils";

interface UseProjectSettingsProps {
  savedData?: any;
}

export const useProjectSettings = ({ savedData }: UseProjectSettingsProps) => {
  const [projectType, setProjectType] = useState("RES010");
  const [surfaceArea, setSurfaceArea] = useState("70");
  const [roofArea, setRoofArea] = useState("85");
  const [ventilationBefore, setVentilationBefore] = useState<VentilationType>("caso1");
  const [ventilationAfter, setVentilationAfter] = useState<VentilationType>("caso1");

  useEffect(() => {
    if (savedData) {
      console.log('🔄 Chargement paramètres projet sauvegardés:', savedData);
      if (savedData.projectType) setProjectType(savedData.projectType);
      if (savedData.surfaceArea) setSurfaceArea(savedData.surfaceArea);
      if (savedData.roofArea) setRoofArea(savedData.roofArea);
      if (savedData.ventilationBefore) setVentilationBefore(savedData.ventilationBefore);
      if (savedData.ventilationAfter) setVentilationAfter(savedData.ventilationAfter);
    }
  }, [savedData]);

  const handleSurfaceAreaChange = (value: string) => {
    console.log('📊 useProjectSettings - Surface combles mise à jour:', value);
    setSurfaceArea(value);
  };

  const handleRoofAreaChange = (value: string) => {
    console.log('📊 useProjectSettings - Surface toiture mise à jour:', value);
    setRoofArea(value);
  };

  return {
    projectType,
    setProjectType,
    surfaceArea,
    setSurfaceArea: handleSurfaceAreaChange,
    roofArea,
    setRoofArea: handleRoofAreaChange,
    ventilationBefore,
    setVentilationBefore,
    ventilationAfter,
    setVentilationAfter,
  };
};
