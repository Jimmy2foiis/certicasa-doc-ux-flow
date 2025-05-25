
import { useProjectCalculationState } from "@/hooks/useProjectCalculationState";
import { useProjectCalculationHandlers } from "./ProjectCalculationHandlers";
import ProjectCalculationLayout from "./ProjectCalculationLayout";

interface ProjectCalculationContainerProps {
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
  clientData?: {
    id?: string;
    name: string;
    nif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ProjectCalculationContainer = ({ 
  clientId, 
  projectId, 
  savedData, 
  onSave,
  clientClimateZone,
  clientClimateConfidence,
  clientClimateMethod,
  clientClimateReferenceCity,
  clientClimateDistance,
  clientClimateDescription,
  clientName,
  clientAddress,
  projectName,
  clientData,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois",
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ProjectCalculationContainerProps) => {
  
  const calculationState = useProjectCalculationState({
    clientId,
    savedData,
    clientClimateZone,
    surfaceArea,
    roofArea,
    floorType
  });

  const handlers = useProjectCalculationHandlers({
    beforeLayers: calculationState.beforeLayers,
    afterLayers: calculationState.afterLayers,
    setBeforeLayers: calculationState.setBeforeLayers,
    setAfterLayers: calculationState.setAfterLayers,
    addLayer: calculationState.addLayer,
    addSouflr47: calculationState.addSouflr47,
    updateLayer: calculationState.updateLayer,
    copyBeforeToAfter: calculationState.copyBeforeToAfter,
    setClimateZone: calculationState.setClimateZone,
    onClimateZoneChange
  });

  // Prepare client data with fallbacks
  const preparedClientData = {
    name: clientData?.name || clientName || 'Client',
    nif: clientData?.nif || '',
    address: clientData?.address || clientAddress || '',
    phone: clientData?.phone || '',
    email: clientData?.email || ''
  };

  const thermalSettings = {
    setRsiBefore: calculationState.setRsiBefore,
    setRseBefore: calculationState.setRseBefore,
    setRsiAfter: calculationState.setRsiAfter,
    setRseAfter: calculationState.setRseAfter,
    setVentilationBefore: calculationState.setVentilationBefore,
    setVentilationAfter: calculationState.setVentilationAfter,
    setRatioBefore: calculationState.setRatioBefore,
    setRatioAfter: calculationState.setRatioAfter,
    copyBeforeToAfter: calculationState.copyBeforeToAfter
  };

  const climateData = {
    clientClimateConfidence,
    clientClimateMethod,
    clientClimateReferenceCity,
    clientClimateDistance,
    clientClimateDescription
  };

  return (
    <ProjectCalculationLayout
      calculationData={{...calculationState.calculationData, climateZone: calculationState.climateZone}}
      climateZone={calculationState.climateZone}
      floorType={floorType}
      clientName={clientName}
      clientAddress={clientAddress}
      projectName={projectName}
      clientData={preparedClientData}
      onSave={onSave}
      handlers={handlers}
      thermalSettings={thermalSettings}
      climateData={climateData}
    />
  );
};

export default ProjectCalculationContainer;
