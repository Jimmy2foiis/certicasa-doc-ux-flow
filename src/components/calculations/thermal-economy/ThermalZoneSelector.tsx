
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Thermometer } from "lucide-react";

interface ThermalZoneSelectorProps {
  selectedClimateZone: string;
  onClimateZoneChange: (zone: string) => void;
  getCoefficient: (zone: string) => number;
  climateConfidence?: number;
  climateMethod?: string;
  climateReferenceCity?: string;
  climateDistance?: number;
  climateDescription?: string;
}

const CLIMATE_ZONES = [
  { zone: 'A3', coefficient: 25 },
  { zone: 'A4', coefficient: 26 },
  { zone: 'B3', coefficient: 32 },
  { zone: 'B4', coefficient: 33 },
  { zone: 'C1', coefficient: 44 },
  { zone: 'C2', coefficient: 45 },
  { zone: 'C3', coefficient: 46 },
  { zone: 'C4', coefficient: 46 },
  { zone: 'D1', coefficient: 60 },
  { zone: 'D2', coefficient: 60 },
  { zone: 'D3', coefficient: 61 },
  { zone: 'E1', coefficient: 74 },
];

const ThermalZoneSelector = ({
  selectedClimateZone,
  onClimateZoneChange,
  getCoefficient,
  climateConfidence,
  climateMethod,
  climateReferenceCity,
  climateDistance,
  climateDescription
}: ThermalZoneSelectorProps) => {

  const renderConfidenceIndicator = () => {
    if (climateConfidence && climateMethod) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">{climateConfidence}%</span>
        </div>
      );
    }
    return null;
  };

  const renderClimateInfo = () => {
    if (climateDescription || climateReferenceCity) {
      return (
        <div className="space-y-2 text-sm text-gray-600">
          {climateDescription && (
            <p>{climateDescription}</p>
          )}
          {climateMethod && climateReferenceCity && (
            <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
              <span className="font-medium">Déterminé automatiquement</span>
              <br />
              Ville référence: {climateReferenceCity}
              {climateDistance && ` (${climateDistance}km)`}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleZoneChange = (zone: string) => {
    onClimateZoneChange(zone);
  };

  const currentCoefficient = getCoefficient(selectedClimateZone);

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2">
        <Thermometer className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-medium text-blue-800">Zone Thermique</Label>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Select
            value={selectedClimateZone}
            onValueChange={handleZoneChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sélectionner une zone" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {CLIMATE_ZONES.map(({ zone, coefficient }) => (
                <SelectItem key={zone} value={zone}>
                  {zone} - Coef: {coefficient}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderConfidenceIndicator()}
        </div>
        
        {selectedClimateZone && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Coefficient G actuel: </span>
            <span className="text-blue-600 font-semibold">{currentCoefficient}</span>
          </div>
        )}
        
        {renderClimateInfo()}
      </div>
    </div>
  );
};

export default ThermalZoneSelector;
