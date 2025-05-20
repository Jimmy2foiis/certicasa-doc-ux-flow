
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import ExportExcelButton from "./ExportExcelButton";
import { CalculationData } from "@/hooks/useCalculationState";

interface CalculationActionsProps {
  calculationData: CalculationData;
  onSave?: (calculationData: any) => void;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
}

const CalculationActions = ({ 
  calculationData, 
  onSave,
  clientName,
  clientAddress,
  projectName
}: CalculationActionsProps) => {
  return (
    <div className="flex gap-2">
      <ExportExcelButton 
        calculationData={calculationData}
        clientName={clientName}
        clientAddress={clientAddress}
        projectName={projectName}
      />
      
      {onSave && (
        <Button 
          onClick={() => onSave(calculationData)} 
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      )}
    </div>
  );
};

export default CalculationActions;
