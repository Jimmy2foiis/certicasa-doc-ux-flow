
import { useState, useEffect } from "react";
import { useProjectCalculationState } from "@/hooks/useProjectCalculationState";
import ProjectCalculationLayout from "./ProjectCalculationLayout";
import ProjectInfoSection from "./ProjectInfoSection";

interface ProjectCalculationProps {
  clientId?: string;
  projectId?: string | null;
  savedData?: any;
  onSave?: (calculationData: any) => void;
  clientClimateZone?: string;
  clientClimateConfidence?: number;
  clientClimateMethod?: string;
  clientClimateReferenceCity?: string;
  clientClimateDistance?: number;
  clientClimateDescription?: string;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ProjectCalculation = ({
  clientId,
  projectId,
  savedData,
  onSave,
  clientClimateZone = "C3",
  clientClimateConfidence,
  clientClimateMethod,
  clientClimateReferenceCity,
  clientClimateDistance,
  clientClimateDescription,
  clientName,
  clientAddress,
  projectName,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois",
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ProjectCalculationProps) => {
  // États locaux pour les surfaces
  const [currentSurfaceArea, setCurrentSurfaceArea] = useState(surfaceArea);
  const [currentRoofArea, setCurrentRoofArea] = useState(roofArea);
  const [currentFloorType, setCurrentFloorType] = useState(floorType);
  const [currentClimateZone, setCurrentClimateZone] = useState(clientClimateZone);

  // Synchroniser avec les props
  useEffect(() => {
    setCurrentSurfaceArea(surfaceArea);
  }, [surfaceArea]);

  useEffect(() => {
    setCurrentRoofArea(roofArea);
  }, [roofArea]);

  useEffect(() => {
    setCurrentFloorType(floorType);
  }, [floorType]);

  useEffect(() => {
    setCurrentClimateZone(clientClimateZone);
  }, [clientClimateZone]);

  const calculationState = useProjectCalculationState({
    clientId,
    savedData: {
      ...savedData,
      surfaceArea: currentSurfaceArea,
      roofArea: currentRoofArea,
      climateZone: currentClimateZone
    },
    clientClimateZone: currentClimateZone,
    surfaceArea: currentSurfaceArea,
    roofArea: currentRoofArea,
    floorType: currentFloorType
  });

  // Gestionnaires combinés pour propager les changements
  const handleSurfaceAreaChangeInternal = (value: string) => {
    console.log('🏠 ProjectCalculation - Surface combles changée:', value);
    setCurrentSurfaceArea(value);
    calculationState.handleSurfaceAreaChange(value);
    if (onSurfaceAreaChange) {
      onSurfaceAreaChange(value);
    }
  };

  const handleRoofAreaChangeInternal = (value: string) => {
    console.log('🏠 ProjectCalculation - Surface toiture changée:', value);
    setCurrentRoofArea(value);
    calculationState.handleRoofAreaChange(value);
    if (onRoofAreaChange) {
      onRoofAreaChange(value);
    }
  };

  const handleFloorTypeChangeInternal = (value: string) => {
    console.log('🏠 ProjectCalculation - Type plancher changé:', value);
    setCurrentFloorType(value);
    calculationState.handleFloorTypeChange(value);
    if (onFloorTypeChange) {
      onFloorTypeChange(value);
    }
  };

  const handleClimateZoneChangeInternal = (value: string) => {
    console.log('🌡️ ProjectCalculation - Zone climatique changée:', value);
    setCurrentClimateZone(value);
    calculationState.handleClimateZoneChange(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };

  const clientData = {
    name: clientName || "Client",
    address: clientAddress,
  };

  const handlers = {
    handleAddLayer: calculationState.handleAddLayer,
    handleUpdateLayer: calculationState.handleUpdateLayer,
    handleDeleteBeforeLayer: calculationState.handleDeleteBeforeLayer,
    handleDeleteAfterLayer: calculationState.handleDeleteAfterLayer,
    handleAddSouflr47: calculationState.handleAddSouflr47,
    handleClimateZoneChange: handleClimateZoneChangeInternal,
  };

  const climateData = {
    clientClimateConfidence,
    clientClimateMethod,
    clientClimateReferenceCity,
    clientClimateDistance,
    clientClimateDescription,
  };

  // Construire l'objet thermalSettings avec toutes les propriétés nécessaires
  const thermalSettings = {
    setRsiBefore: calculationState.setRsiBefore,
    setRseBefore: calculationState.setRseBefore,
    setRsiAfter: calculationState.setRsiAfter,
    setRseAfter: calculationState.setRseAfter,
    setVentilationBefore: calculationState.setVentilationBefore,
    setVentilationAfter: calculationState.setVentilationAfter,
    setRatioBefore: calculationState.setRatioBefore,
    setRatioAfter: calculationState.setRatioAfter,
    copyBeforeToAfter: calculationState.copyBeforeToAfter,
  };

  return (
    <div className="space-y-6">
      {/* Section Informations Projet - SEULE VERSION FONCTIONNELLE */}
      <ProjectInfoSection
        surfaceArea={currentSurfaceArea}
        roofArea={currentRoofArea}
        floorType={currentFloorType}
        climateZone={currentClimateZone}
        onSurfaceAreaChange={handleSurfaceAreaChangeInternal}
        onRoofAreaChange={handleRoofAreaChangeInternal}
        onFloorTypeChange={handleFloorTypeChangeInternal}
        onClimateZoneChange={handleClimateZoneChangeInternal}
      />

      {/* Module de Calcul */}
      <ProjectCalculationLayout
        calculationData={calculationState.calculationData}
        climateZone={currentClimateZone}
        floorType={currentFloorType}
        clientName={clientName}
        clientAddress={clientAddress}
        projectName={projectName}
        clientData={clientData}
        onSave={onSave}
        handlers={handlers}
        thermalSettings={thermalSettings}
        climateData={climateData}
      />
    </div>
  );
};

export default ProjectCalculation;
