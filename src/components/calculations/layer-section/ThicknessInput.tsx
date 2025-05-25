
import { Input } from "@/components/ui/input";

interface ThicknessInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ThicknessInput = ({ value, onChange }: ThicknessInputProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8"
        step="0.001"
        min="0.001"
      />
      <span className="text-xs text-gray-500">m</span>
    </div>
  );
};

export default ThicknessInput;
