
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CalculationActions from "./CalculationActions";
import { CalculationData } from "@/hooks/useCalculationState";

interface CalculationHeaderProps {
  calculationData: CalculationData;
  onSave?: (calculationData: any) => void;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
}

const CalculationHeader = ({ 
  calculationData,
  onSave,
  clientName,
  clientAddress,
  projectName
}: CalculationHeaderProps) => {
  return (
    <CardHeader className="pb-2 flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-lg font-semibold">Module de Calcul</CardTitle>
        <CardDescription>
          Saisissez les matériaux et épaisseurs pour calculer la résistance thermique
        </CardDescription>
      </div>
      <CalculationActions 
        calculationData={calculationData}
        onSave={onSave}
        clientName={clientName}
        clientAddress={clientAddress}
        projectName={projectName}
      />
    </CardHeader>
  );
};

export default CalculationHeader;
