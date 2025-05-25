
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CalculationActionsWithBilling from "./CalculationActionsWithBilling";
import ProjectInfoSection from "./ProjectInfoSection";
import { CalculationData } from "@/hooks/useCalculationState";

interface CalculationHeaderProps {
  calculationData: CalculationData;
  onSave?: (calculationData: any) => void;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
  clientData?: {
    name: string;
    nif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  floorType?: string;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const CalculationHeader = ({ 
  calculationData,
  onSave,
  clientName,
  clientAddress,
  projectName,
  clientData,
  onSurfaceAreaChange,
  onRoofAreaChange,
  floorType = "Bois",
  onFloorTypeChange,
  onClimateZoneChange
}: CalculationHeaderProps) => {
  return (
    <div>
      {/* Section Informations Projet */}
      <ProjectInfoSection 
        surfaceArea={calculationData.surfaceArea}
        roofArea={calculationData.roofArea}
        climateZone={calculationData.climateZone}
        floorType={floorType}
        onSurfaceAreaChange={onSurfaceAreaChange}
        onRoofAreaChange={onRoofAreaChange}
        onFloorTypeChange={onFloorTypeChange}
        onClimateZoneChange={onClimateZoneChange}
      />
      
      {/* Header du calcul */}
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Module de Calcul</CardTitle>
          <CardDescription>
            Saisissez les matériaux et épaisseurs pour calculer la résistance thermique
          </CardDescription>
        </div>
        <CalculationActionsWithBilling 
          calculationData={calculationData}
          onSave={onSave}
          clientName={clientName}
          clientAddress={clientAddress}
          projectName={projectName}
          clientData={clientData}
        />
      </CardHeader>
    </div>
  );
};

export default CalculationHeader;
