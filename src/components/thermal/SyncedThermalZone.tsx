
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer } from "lucide-react";

interface SyncedThermalZoneProps {
  geoZone?: string;
  onUpdateCalcs: (zone: string, coefficient: number) => void;
}

const SyncedThermalZone = ({ geoZone, onUpdateCalcs }: SyncedThermalZoneProps) => {
  const [thermalZone, setThermalZone] = useState(geoZone || "C3");
  
  const coefficients = {
    "A3": 25,
    "A4": 26,
    "B3": 32,
    "B4": 33,
    "C1": 44,
    "C2": 45,
    "C3": 46,
    "C4": 46,
    "D1": 60,
    "D2": 60,
    "D3": 61,
    "E1": 74,
  };

  // SYNCHRONISATION AUTOMATIQUE avec la zone géographique
  useEffect(() => {
    if (geoZone && geoZone !== thermalZone) {
      console.log('🔄 SyncedThermalZone - Synchronisation automatique vers:', geoZone);
      setThermalZone(geoZone);
      onUpdateCalcs(geoZone, coefficients[geoZone as keyof typeof coefficients] || 46);
    }
  }, [geoZone]);

  const handleZoneChange = (zone: string) => {
    console.log('🌡️ SyncedThermalZone - Changement manuel vers:', zone);
    setThermalZone(zone);
    onUpdateCalcs(zone, coefficients[zone as keyof typeof coefficients] || 46);
  };

  const currentCoefficient = coefficients[thermalZone as keyof typeof coefficients] || 46;

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2">
        <Thermometer className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-medium text-blue-800">
          Zone Thermique 
          <span className="ml-2 text-primary font-bold">
            (G: {currentCoefficient})
          </span>
        </Label>
      </div>
      
      <Select 
        value={thermalZone} 
        onValueChange={handleZoneChange}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sélectionner une zone" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-50">
          {Object.entries(coefficients).map(([zone, g]) => (
            <SelectItem key={zone} value={zone}>
              {zone} - Coefficient {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="text-sm text-gray-600">
        <span className="font-medium">Coefficient G actuel: </span>
        <span className="text-blue-600 font-semibold">{currentCoefficient}</span>
      </div>
    </div>
  );
};

export default SyncedThermalZone;
