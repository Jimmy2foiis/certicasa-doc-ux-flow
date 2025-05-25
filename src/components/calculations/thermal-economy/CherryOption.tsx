
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Cherry } from "lucide-react";

interface CherryOptionProps {
  cherryEnabled: boolean;
  onCherryEnabledChange: (checked: boolean) => void;
  pricePerSqm: number;
  projectPrice: number;
  cherryPricePerSqm: number;
  cherryProjectPrice: number;
  totalPricePerSqm: number;
  totalProjectPrice: number;
}

const CherryOption = ({
  cherryEnabled,
  onCherryEnabledChange,
  pricePerSqm,
  projectPrice,
  cherryPricePerSqm,
  cherryProjectPrice,
  totalPricePerSqm,
  totalProjectPrice
}: CherryOptionProps) => {
  return (
    <>
      {/* Cherry Option */}
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="cherry"
          checked={cherryEnabled}
          onCheckedChange={(checked) => onCherryEnabledChange(checked === true)}
        />
        <Label htmlFor="cherry" className="flex items-center cursor-pointer">
          <Cherry className="h-4 w-4 mr-2 text-red-500" />
          Cerise
        </Label>
      </div>
      
      {/* Cherry Calculations */}
      {cherryEnabled && (
        <div className="space-y-2 bg-rose-50 p-4 rounded-md border border-rose-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Prix Cerise (10% du prix au m²)</div>
              <div className="font-medium">{cherryPricePerSqm.toFixed(2)} €/m²</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Prix Cerise (10% du prix projet)</div>
              <div className="font-medium">{cherryProjectPrice.toFixed(2)} €</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Prix au m² + Cerise</div>
              <div className="font-medium">
                {pricePerSqm.toFixed(2)} + {cherryPricePerSqm.toFixed(2)} = {totalPricePerSqm.toFixed(2)} €/m²
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Prix projet + Cerise</div>
              <div className="font-medium">
                {projectPrice.toFixed(2)} + {cherryProjectPrice.toFixed(2)} = {totalProjectPrice.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CherryOption;
