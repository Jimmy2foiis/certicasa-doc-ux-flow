
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VentilationType } from "@/utils/calculationUtils";

interface VentilationRatioControlsProps {
  ventilationType: VentilationType;
  setVentilationType: (value: VentilationType) => void;
  ratioValue: number;
  setRatioValue: (value: number) => void;
  isAfterWork?: boolean;
}

const VentilationRatioControls = ({
  ventilationType,
  setVentilationType,
  ratioValue,
  setRatioValue,
  isAfterWork = false
}: VentilationRatioControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`ventilation-${isAfterWork ? 'after' : 'before'}`}>Type de ventilation</Label>
        <Select 
          value={ventilationType}
          onValueChange={(value: VentilationType) => setVentilationType(value)}
        >
          <SelectTrigger id={`ventilation-${isAfterWork ? 'after' : 'before'}`}>
            <SelectValue placeholder="Sélectionner ventilation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="caso1">Légèrement ventilé (Caso 1)</SelectItem>
            <SelectItem value="caso2">Très ventilé (Caso 2)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`ratio-${isAfterWork ? 'after' : 'before'}`}>Ratio Combles/Toiture: {ratioValue.toFixed(2)}</Label>
        <Input
          id={`ratio-${isAfterWork ? 'after' : 'before'}`}
          value={ratioValue.toString()}
          onChange={(e) => setRatioValue(parseFloat(e.target.value) || 0)}
          type="number"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default VentilationRatioControls;
