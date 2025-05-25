
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { climateZoneCoefficients } from "./constants";

interface ClimateZoneSelectorProps {
  selectedClimateZone: string;
  onClimateZoneChange: (zone: string) => void;
}

const ClimateZoneSelector = ({ selectedClimateZone, onClimateZoneChange }: ClimateZoneSelectorProps) => {
  const gCoefficient = climateZoneCoefficients[selectedClimateZone] || 46;

  return (
    <div className="space-y-2">
      <Label htmlFor="climate-zone">Zone Climatique</Label>
      <div className="flex items-center space-x-2">
        <Select
          value={selectedClimateZone}
          onValueChange={onClimateZoneChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A3">A3 (Coeff: 25)</SelectItem>
            <SelectItem value="A4">A4 (Coeff: 26)</SelectItem>
            <SelectItem value="B3">B3 (Coeff: 32)</SelectItem>
            <SelectItem value="B4">B4 (Coeff: 33)</SelectItem>
            <SelectItem value="C1">C1 (Coeff: 44)</SelectItem>
            <SelectItem value="C2">C2 (Coeff: 45)</SelectItem>
            <SelectItem value="C3">C3 (Coeff: 46)</SelectItem>
            <SelectItem value="C4">C4 (Coeff: 46)</SelectItem>
            <SelectItem value="D1">D1 (Coeff: 60)</SelectItem>
            <SelectItem value="D2">D2 (Coeff: 60)</SelectItem>
            <SelectItem value="D3">D3 (Coeff: 61)</SelectItem>
            <SelectItem value="E1">E1 (Coeff: 74)</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">(G: {gCoefficient})</span>
      </div>
    </div>
  );
};

export default ClimateZoneSelector;
