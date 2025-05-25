
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RsiRseInputsProps {
  rsi: string;
  setRsi: (value: string) => void;
  rse: string;
  setRse: (value: string) => void;
  isAfterWork?: boolean;
}

const RsiRseInputs = ({ rsi, setRsi, rse, setRse, isAfterWork = false }: RsiRseInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`rsi-${isAfterWork ? 'after' : 'before'}`}>RSI (m²K/W)</Label>
        <Input
          id={`rsi-${isAfterWork ? 'after' : 'before'}`}
          value={rsi}
          onChange={(e) => setRsi(e.target.value)}
          type="number"
          step="0.01"
          placeholder="0.10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`rse-${isAfterWork ? 'after' : 'before'}`}>RSE (m²K/W)</Label>
        <Input
          id={`rse-${isAfterWork ? 'after' : 'before'}`}
          value={rse}
          onChange={(e) => setRse(e.target.value)}
          type="number"
          step="0.01"
          placeholder="0.10"
        />
      </div>
    </div>
  );
};

export default RsiRseInputs;
