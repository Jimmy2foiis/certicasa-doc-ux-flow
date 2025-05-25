
import { calculateUpValue } from "@/utils/calculationUtils";

interface CalculationSummaryProps {
  totalR: number;
  bCoefficient: number;
  uValue: number;
  isAfterWork?: boolean;
}

const CalculationSummary = ({ totalR, bCoefficient, uValue, isAfterWork = false }: CalculationSummaryProps) => {
  const upValue = calculateUpValue(totalR);

  return (
    <div className="p-3 bg-gray-50 border-t">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Résistance thermique totale (avec Rsi + Rse):</span>
          <span className="ml-2 font-medium">{totalR.toFixed(3)} m²K/W</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Up (transmittance avant coefficient b):</span>
          <span className="ml-2 font-medium">{upValue.toFixed(3)} W/m²K</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Coefficient b:</span>
          <span className="ml-2 font-medium">{bCoefficient.toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center font-semibold">
          <span className="text-sm">
            {isAfterWork ? "Uf (transmittance après coefficient b)" : "Ui (transmittance après coefficient b)"}:
          </span>
          <span className="ml-2">{uValue.toFixed(3)} W/m²K</span>
        </div>
      </div>
    </div>
  );
};

export default CalculationSummary;
