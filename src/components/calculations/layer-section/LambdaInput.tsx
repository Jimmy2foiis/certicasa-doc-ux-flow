
import { Input } from "@/components/ui/input";

interface LambdaInputProps {
  value: string;
  onChange: (value: string) => void;
}

const LambdaInput = ({ value, onChange }: LambdaInputProps) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8"
    />
  );
};

export default LambdaInput;
