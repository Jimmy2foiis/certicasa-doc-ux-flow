
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
  floorType?: string;
  climateZone?: string;
}

const CalculationHeader = ({ 
  calculationData,
  onSave,
  clientName,
  clientAddress,
  projectName,
  clientData,
  floorType = "Bois",
  climateZone = "C3"
}: CalculationHeaderProps) => {
  return (
    <div>
      {/* 3️⃣ Section Informations Projet - reçoit zoneClimatique */}
      <ProjectInfoSection 
        surfaceArea={calculationData.surfaceArea}
        roofArea={calculationData.roofArea}
        climateZone={climateZone}
        floorType={floorType}
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
