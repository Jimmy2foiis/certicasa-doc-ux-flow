
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, MapPin } from 'lucide-react';

// Table officielle des coefficients G
const THERMAL_COEFFICIENTS = {
  "A3": 25, "A4": 26, "B3": 32, "B4": 33,
  "C1": 44, "C2": 45, "C3": 46, "C4": 46,
  "D1": 60, "D2": 60, "D3": 61, "E1": 74,
} as const;

interface ThermalZoneSyncProps {
  geolocatedZone: string | null;      // Zone depuis ClimateZoneDisplay
  onCoefficientChange: (zone: string, coefficient: number) => void;
}

export function ThermalZoneSync({ 
  geolocatedZone, 
  onCoefficientChange 
}: ThermalZoneSyncProps) {
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [isSynced, setIsSynced] = useState(true);

  // 🔄 SYNCHRONISATION AUTOMATIQUE - Correction du problème
  useEffect(() => {
    console.log('🔄 ThermalZoneSync - geolocatedZone reçue:', geolocatedZone);
    console.log('🔄 ThermalZoneSync - selectedZone actuelle:', selectedZone);
    
    if (geolocatedZone && geolocatedZone in THERMAL_COEFFICIENTS) {
      const coefficient = THERMAL_COEFFICIENTS[geolocatedZone as keyof typeof THERMAL_COEFFICIENTS];
      console.log(`🔄 Synchronisation: ${geolocatedZone} → Coef G: ${coefficient}`);
      
      setSelectedZone(geolocatedZone);
      setIsSynced(true);
      onCoefficientChange(geolocatedZone, coefficient);
    } else if (geolocatedZone && !selectedZone) {
      // Si la zone géolocalisée n'est pas dans notre table, utiliser C3 par défaut
      console.log('🔄 Zone non reconnue, utilisation de C3 par défaut');
      setSelectedZone('C3');
      setIsSynced(false);
      onCoefficientChange('C3', THERMAL_COEFFICIENTS.C3);
    }
  }, [geolocatedZone, onCoefficientChange]);

  const handleManualChange = (newZone: string) => {
    console.log(`🎯 Changement manuel: ${newZone} → Coef G: ${THERMAL_COEFFICIENTS[newZone as keyof typeof THERMAL_COEFFICIENTS]}`);
    setSelectedZone(newZone);
    setIsSynced(newZone === geolocatedZone);
    onCoefficientChange(newZone, THERMAL_COEFFICIENTS[newZone as keyof typeof THERMAL_COEFFICIENTS]);
  };

  const currentCoefficient = THERMAL_COEFFICIENTS[selectedZone as keyof typeof THERMAL_COEFFICIENTS] || 0;

  return (
    <div className="space-y-3">
      {/* Header avec statut */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Zone Thermique CTE
        </Label>
        <div className="flex items-center gap-2">
          {isSynced && geolocatedZone && (
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Synchronisé
            </Badge>
          )}
          {currentCoefficient > 0 && (
            <Badge variant="default" className="font-mono">
              G = {currentCoefficient}
            </Badge>
          )}
        </div>
      </div>

      {/* Sélecteur principal */}
      <Select value={selectedZone} onValueChange={handleManualChange}>
        <SelectTrigger className={!isSynced && geolocatedZone ? "ring-2 ring-orange-500" : ""}>
          <SelectValue placeholder="Sélectionner une zone">
            {selectedZone && (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{selectedZone}</span>
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

      {/* Alerte de désynchronisation */}
      {!isSynced && geolocatedZone && (
        <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-md">
          <span className="text-sm text-orange-600 dark:text-orange-400">
            Zone géolocalisée : {geolocatedZone} (G={THERMAL_COEFFICIENTS[geolocatedZone as keyof typeof THERMAL_COEFFICIENTS]})
          </span>
          <button
            onClick={() => handleManualChange(geolocatedZone)}
            className="text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            Resynchroniser
          </button>
        </div>
      )}

      {/* Info calculs */}
      {selectedZone && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <div>Impact du coefficient G = {currentCoefficient} :</div>
          <div className="font-mono mt-1">
            CAE = Surface × ΔU × {currentCoefficient}
          </div>
        </div>
      )}
    </div>
  );
}
