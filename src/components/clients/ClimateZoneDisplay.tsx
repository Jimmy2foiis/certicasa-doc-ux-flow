
import React from "react";
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
    case 'A': return 'destructive'; // Rouge pour très chaud
    case 'B': return 'default'; // Bleu pour chaud
    case 'C': return 'secondary'; // Gris pour tempéré
    case 'D': return 'outline'; // Outline pour froid
    case 'E': return 'secondary'; // Gris pour montagne
    default: return 'secondary';
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
  editable = true
}: ClimateZoneDisplayProps) => {
  const confidenceColor = getConfidenceColor(confidence);
  const confidenceIcon = getConfidenceIcon(confidence);
  const zoneBadgeVariant = getZoneBadgeColor(climateZone);

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2">
        <Thermometer className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Zone Climatique CTE</span>
      </div>
      
      <div className="space-y-3">
        {/* Sélecteur de zone */}
        <div className="flex items-center gap-3">
          {editable ? (
            <Select value={climateZone || ''} onValueChange={onZoneChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                {CLIMATE_ZONES.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge variant={zoneBadgeVariant} className="px-3 py-1">
              {climateZone || 'Non définie'}
            </Badge>
          )}
          
          {confidence && (
            <div className={`flex items-center gap-1 text-${confidenceColor}-600`}>
              {confidenceIcon}
              <span className="text-xs font-medium">{confidence}%</span>
            </div>
          )}
        </div>

        {/* Description */}
        {(description || ZONE_DESCRIPTIONS[climateZone as keyof typeof ZONE_DESCRIPTIONS]) && (
          <p className="text-xs text-gray-600">
            {description || ZONE_DESCRIPTIONS[climateZone as keyof typeof ZONE_DESCRIPTIONS]}
          </p>
        )}

        {/* Information de détermination automatique */}
        {method && referenceCity && (
          <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
            <span className="font-medium">Déterminé automatiquement</span>
            <br />
            Ville référence: {referenceCity}
            {distance && ` (${distance}km)`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateZoneDisplay;
