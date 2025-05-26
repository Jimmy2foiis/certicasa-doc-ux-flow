import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ZONE_DESCRIPTIONS } from "@/utils/climateZonesData";
interface ClimateZoneDisplayProps {
  climateZone?: string;
  confidence?: number;
  method?: string;
  referenceCity?: string;
  distance?: number;
  description?: string;
  onZoneChange?: (zone: string) => void;
  editable?: boolean;
  compact?: boolean;
}
const CLIMATE_ZONES = ['A3', 'A4', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'E1'];
const getConfidenceColor = (confidence?: number) => {
  if (!confidence) return 'gray';
  if (confidence >= 90) return 'green';
  if (confidence >= 75) return 'orange';
  return 'red';
};
const getConfidenceIcon = (confidence?: number) => {
  if (!confidence) return <XCircle className="h-3 w-3" />;
  if (confidence >= 90) return <CheckCircle2 className="h-3 w-3" />;
  if (confidence >= 75) return <AlertTriangle className="h-3 w-3" />;
  return <XCircle className="h-3 w-3" />;
};
const getZoneBadgeColor = (zone?: string) => {
  if (!zone) return 'secondary';
  const letter = zone.charAt(0);
  switch (letter) {
    case 'A':
      return 'destructive';
    // Rouge pour très chaud
    case 'B':
      return 'default';
    // Bleu pour chaud
    case 'C':
      return 'secondary';
    // Gris pour tempéré
    case 'D':
      return 'outline';
    // Outline pour froid
    case 'E':
      return 'secondary';
    // Gris pour montagne
    default:
      return 'secondary';
  }
};
const ClimateZoneDisplay = ({
  climateZone,
  confidence,
  method,
  referenceCity,
  distance,
  description,
  onZoneChange,
  editable = true,
  compact = false
}: ClimateZoneDisplayProps) => {
  const confidenceColor = getConfidenceColor(confidence);
  const confidenceIcon = getConfidenceIcon(confidence);
  const zoneBadgeVariant = getZoneBadgeColor(climateZone);

  // 🚨 DEBUG: Tracer quand la zone climatique change automatiquement
  useEffect(() => {
    if (climateZone && method) {
      console.error('🚨 ClimateZoneDisplay - Zone déterminée automatiquement:', climateZone);
      console.error('🚨 ClimateZoneDisplay - Confiance:', confidence, '% - Méthode:', method);
      console.error('🚨 ClimateZoneDisplay - Ville référence:', referenceCity);
      if (onZoneChange) {
        console.error('🚨 ClimateZoneDisplay - ÉMISSION vers parent:', climateZone);
        onZoneChange(climateZone);
      } else {
        console.error('🚨 ClimateZoneDisplay - ERREUR: onZoneChange est undefined !');
      }
    }
  }, [climateZone, method, confidence, referenceCity, onZoneChange]);
  const handleZoneChange = (zone: string) => {
    console.error('🚨 ClimateZoneDisplay - Changement manuel vers:', zone);
    if (onZoneChange) {
      console.error('🚨 ClimateZoneDisplay - ÉMISSION changement manuel:', zone);
      onZoneChange(zone);
    } else {
      console.error('🚨 ClimateZoneDisplay - ERREUR: onZoneChange est undefined pour changement manuel !');
    }
  };

  // Version compacte pour s'adapter aux autres champs
  if (compact) {
    return <div className="h-full">
        {editable ? <Select value={climateZone || ''} onValueChange={handleZoneChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              {CLIMATE_ZONES.map(zone => <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>)}
            </SelectContent>
          </Select> : <div className="h-8 flex items-center">
            <Badge variant={zoneBadgeVariant} className="px-2 py-1 text-xs">
              {climateZone || 'Non définie'}
            </Badge>
          </div>}
      </div>;
  }

  // Version complète originale
  return;
};
export default ClimateZoneDisplay;