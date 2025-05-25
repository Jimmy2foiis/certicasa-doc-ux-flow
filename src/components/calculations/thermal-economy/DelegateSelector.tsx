
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DelegateType } from "./constants";

interface DelegateSelectorProps {
  delegate: DelegateType;
  onDelegateChange: (value: DelegateType) => void;
}

const DelegateSelector = ({ delegate, onDelegateChange }: DelegateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="delegate">Sujet délégataire</Label>
      <Select
        value={delegate}
        onValueChange={onDelegateChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un délégataire" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Eiffage">Eiffage (0,130)</SelectItem>
          <SelectItem value="GreenFlex">GreenFlex (0,115)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DelegateSelector;
