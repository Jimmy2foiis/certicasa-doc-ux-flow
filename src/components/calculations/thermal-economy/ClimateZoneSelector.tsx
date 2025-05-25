
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface ClimateZoneSelectorProps {
  selectedClimateZone: string;
  onClimateZoneChange: (zone: string) => void;
  getCoefficient: (zone: string) => number;
  climateConfidence?: number;
  climateMethod?: string;
  climateReferenceCity?: string;
  climateDistance?: number;
  climateDescription?: string;
}

const ClimateZoneSelector = ({
  selectedClimateZone,
  onClimateZoneChange,
  getCoefficient,
  climateConfidence,
  climateMethod,
  climateReferenceCity,
  climateDistance,
  climateDescription
}: ClimateZoneSelectorProps) => {
  
  // 🚨 DEBUG URGENT: Tracer toutes les props reçues
  console.log('🔥 ClimateZoneSelector - PROPS REÇUES:', {
    selectedClimateZone,
    climateConfidence,
    climateMethod,
    climateReferenceCity,
    climateDistance,
    climateDescription
  });

  // 🚨 DEBUG: Surveiller les changements de zone
  useEffect(() => {
    console.log('🔄 ClimateZoneSelector - selectedClimateZone changé:', selectedClimateZone);
  }, [selectedClimateZone]);

  // Afficher l'indicateur de confiance comme dans l'image
  const renderConfidenceIndicator = () => {
    console.log('🎯 ClimateZoneSelector - Rendu confiance:', { climateConfidence, climateMethod });
    
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

  // Afficher la description et les informations automatiques
  const renderClimateInfo = () => {
    console.log('🎯 ClimateZoneSelector - Rendu info:', { climateDescription, climateReferenceCity, climateMethod });
    
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

  // 🚨 DEBUG: Handler de changement
  const handleZoneChange = (zone: string) => {
    console.log('🌍 ClimateZoneSelector - Changement manuel zone:', zone);
    onClimateZoneChange(zone);
  };

  return (
    <div className="space-y-2">
      {/* 🚨 DEBUG: Afficher la zone dans le log */}
      {console.log('🎯 ClimateZoneSelector - RENDU FINAL avec zone:', selectedClimateZone)}
      
      <Label htmlFor="climate-zone" className="flex items-center gap-2">
        Zone Climatique
        {selectedClimateZone && (
          <span className="font-normal text-muted-foreground text-sm">
            (G: {getCoefficient(selectedClimateZone)})
          </span>
        )}
        {/* 🚨 DEBUG: Afficher la zone dans le label */}
        <span className="text-xs text-red-600 font-bold">[DEBUG: {selectedClimateZone}]</span>
      </Label>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Select
            value={selectedClimateZone}
            onValueChange={handleZoneChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sélectionner une zone" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="A3">A3 (G: 25)</SelectItem>
              <SelectItem value="A4">A4 (G: 26)</SelectItem>
              <SelectItem value="B3">B3 (G: 32)</SelectItem>
              <SelectItem value="B4">B4 (G: 33)</SelectItem>
              <SelectItem value="C1">C1 (G: 44)</SelectItem>
              <SelectItem value="C2">C2 (G: 45)</SelectItem>
              <SelectItem value="C3">C3 (G: 46)</SelectItem>
              <SelectItem value="C4">C4 (G: 46)</SelectItem>
              <SelectItem value="D1">D1 (G: 60)</SelectItem>
              <SelectItem value="D2">D2 (G: 60)</SelectItem>
              <SelectItem value="D3">D3 (G: 61)</SelectItem>
              <SelectItem value="E1">E1 (G: 74)</SelectItem>
            </SelectContent>
          </Select>
          {renderConfidenceIndicator()}
        </div>
        {renderClimateInfo()}
      </div>
    </div>
  );
};

export default ClimateZoneSelector;
