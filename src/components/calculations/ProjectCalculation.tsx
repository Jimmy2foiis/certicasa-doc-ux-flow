
import ProjectCalculationContainer from "./ProjectCalculationContainer";

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

const ProjectCalculation = (props: ProjectCalculationProps) => {
  return <ProjectCalculationContainer {...props} />;
};

export default ProjectCalculation;
