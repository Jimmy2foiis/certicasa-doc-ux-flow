
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCalculation from "../calculations/ProjectCalculation";

interface ProjectCalculationViewProps {
  client: any;
  clientId: string;
  currentProjectId: string | null;
  savedCalculations: Array<{
    id: string;
    projectId: string;
    projectName: string;
    clientId: string;
    type: string;
    surface: number;
    date: string;
    improvement: number;
    calculationData: any;
  }>;
  onBack: () => void;
  onSave: (calculationData: any) => void;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ProjectCalculationView = ({ 
  client, 
  clientId, 
  currentProjectId, 
  savedCalculations, 
  onBack, 
  onSave,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois",
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ProjectCalculationViewProps) => {
  const [currentSurfaceArea, setCurrentSurfaceArea] = useState(surfaceArea);
  const [currentRoofArea, setCurrentRoofArea] = useState(roofArea);
  const [currentFloorType, setCurrentFloorType] = useState(floorType);
  const [currentClimateZone, setCurrentClimateZone] = useState(client?.climateZone || "C3");

  // Find the calculation data if we're editing an existing calculation
  const currentCalculation = currentProjectId
    ? savedCalculations.find(c => c.projectId === currentProjectId)
    : undefined;
    
  const calculationData = currentCalculation?.calculationData;

  // Synchroniser les valeurs quand elles changent depuis la sidebar
  useEffect(() => {
    setCurrentSurfaceArea(surfaceArea);
  }, [surfaceArea]);

  useEffect(() => {
    setCurrentRoofArea(roofArea);
  }, [roofArea]);

  useEffect(() => {
    setCurrentFloorType(floorType);
  }, [floorType]);

  const handleSurfaceAreaChangeInternal = (value: string) => {
    setCurrentSurfaceArea(value);
    if (onSurfaceAreaChange) {
      onSurfaceAreaChange(value);
    }
  };

  const handleRoofAreaChangeInternal = (value: string) => {
    setCurrentRoofArea(value);
    if (onRoofAreaChange) {
      onRoofAreaChange(value);
    }
  };

  const handleFloorTypeChangeInternal = (value: string) => {
    setCurrentFloorType(value);
    if (onFloorTypeChange) {
      onFloorTypeChange(value);
    }
  };

  const handleClimateZoneChangeInternal = (value: string) => {
    setCurrentClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };
    
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-xl font-semibold">
          {currentProjectId 
            ? `Modification du calcul pour ${client.name}` 
            : `Nouveau calcul pour ${client.name}`}
        </h2>
      </div>
      <ProjectCalculation 
        clientId={clientId} 
        projectId={currentProjectId}
        savedData={calculationData}
        onSave={onSave}
        clientClimateZone={currentClimateZone}
        clientName={client.name}
        clientAddress={client.address}
        projectName={currentCalculation?.projectName}
        surfaceArea={currentSurfaceArea}
        roofArea={currentRoofArea}
        floorType={currentFloorType}
        onSurfaceAreaChange={handleSurfaceAreaChangeInternal}
        onRoofAreaChange={handleRoofAreaChangeInternal}
        onFloorTypeChange={handleFloorTypeChangeInternal}
        onClimateZoneChange={handleClimateZoneChangeInternal}
      />
    </div>
  );
};

export default ProjectCalculationView;
