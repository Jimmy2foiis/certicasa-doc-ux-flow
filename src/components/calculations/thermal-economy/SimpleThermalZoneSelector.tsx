
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";

// Table officielle des coefficients G
const THERMAL_COEFFICIENTS = {
  "A3": 25, "A4": 26, "B3": 32, "B4": 33,
  "C1": 44, "C2": 45, "C3": 46, "C4": 46,
  "D1": 60, "D2": 60, "D3": 61, "E1": 74,
} as const;

interface SimpleThermalZoneSelectorProps {
  value: string;
  onChange: (zone: string) => void;
  geolocatedZone?: string; // Zone du ClimateZoneDisplay du haut
}

const SimpleThermalZoneSelector = ({
  value,
  onChange,
  geolocatedZone
}: SimpleThermalZoneSelectorProps) => {

  const currentCoefficient = THERMAL_COEFFICIENTS[value as keyof typeof THERMAL_COEFFICIENTS] || 46;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Zone Thermique Calculs
        </Label>
        <Badge variant="default" className="font-mono">
          G = {currentCoefficient}
        </Badge>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une zone">
            {value && (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{value}</span>
                <span className="text-muted-foreground text-sm">
                  Coefficient {currentCoefficient}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-50">
          <div className="p-2 text-xs text-muted-foreground border-b">
            Zones climatiques et coefficients G
          </div>
          {Object.entries(THERMAL_COEFFICIENTS).map(([zone, coef]) => (
            <SelectItem key={zone} value={zone}>
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">{zone}</span>
                <span className="text-sm text-muted-foreground ml-8">
                  G = {coef}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {geolocatedZone && geolocatedZone !== value && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          Zone détectée: {geolocatedZone} (G={THERMAL_COEFFICIENTS[geolocatedZone as keyof typeof THERMAL_COEFFICIENTS] || 'N/A'})
          <button
            onClick={() => onChange(geolocatedZone)}
            className="ml-2 font-medium underline hover:no-underline"
          >
            Utiliser
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleThermalZoneSelector;
