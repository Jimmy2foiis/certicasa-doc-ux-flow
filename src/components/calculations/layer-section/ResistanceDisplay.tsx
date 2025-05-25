
import { Input } from "@/components/ui/input";

interface ResistanceDisplayProps {
  value: number;
}

const ResistanceDisplay = ({ value }: ResistanceDisplayProps) => {
  return (
    <Input
      value={value.toFixed(3)}
      readOnly
      className="h-8 bg-gray-50"
    />
  );
};

export default ResistanceDisplay;
