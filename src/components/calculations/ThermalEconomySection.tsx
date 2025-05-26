
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThermalEconomyCalculations } from "@/hooks/useThermalEconomyCalculations";
import DelegateSelector from "./thermal-economy/DelegateSelector";
import CalculationsDisplay from "./thermal-economy/CalculationsDisplay";
import CherryOption from "./thermal-economy/CherryOption";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Climate zone coefficients mapping
export const climateZoneCoefficients: Record<string, number> = {
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

interface ThermalEconomySectionProps {
  surfaceArea: number;
  uValueBefore: number;
  uValueAfter: number;
  climateZone?: string;
  projectType: string;
  climateConfidence?: number;
  climateMethod?: string;
  climateReferenceCity?: string;
  climateDistance?: number;
  climateDescription?: string;
  onClimateZoneChange?: (zone: string) => void;
}

const ThermalEconomySection = ({ 
  surfaceArea, 
  uValueBefore, 
  uValueAfter, 
  climateZone = "C3",
  projectType,
  climateConfidence,
  climateMethod,
  climateReferenceCity,
  climateDistance,
  climateDescription,
  onClimateZoneChange
}: ThermalEconomySectionProps) => {
  
  // 🚨 DEBUG TRÈS DÉTAILLÉ
  console.error('🚨 ThermalEconomySection - PROPS REÇUES:');
  console.error('🚨 climateZone type:', typeof climateZone);
  console.error('🚨 climateZone value:', climateZone);
  console.error('🚨 climateZone length:', climateZone?.length);
  console.error('🚨 climateZone chars:', climateZone?.split('').map((c, i) => `[${i}]=${c}`));
  console.error('🚨 climateZone === "D2":', climateZone === "D2");
  console.error('🚨 climateZone in coefficients:', climateZone in climateZoneCoefficients);
  console.error('🚨 coefficient trouvé:', climateZoneCoefficients[climateZone || ""]);
  console.error('🚨 onClimateZoneChange function:', typeof onClimateZoneChange);

  const {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    gCoefficient,
    annualSavings,
    projectPrice,
    pricePerSqm,
    cherryPricePerSqm,
    cherryProjectPrice,
    totalPricePerSqm,
    totalProjectPrice
  } = useThermalEconomyCalculations({
    surfaceArea,
    uValueBefore,
    uValueAfter,
    climateZone: climateZone || "C3"
  });

  const handleClimateZoneChange = (zone: string) => {
    console.error('🚨 ThermalEconomySection - Changement manuel vers:', zone);
    console.error('🚨 onClimateZoneChange disponible:', !!onClimateZoneChange);
    if (onClimateZoneChange) {
      console.error('🚨 Appel onClimateZoneChange avec:', zone);
      onClimateZoneChange(zone);
    } else {
      console.error('🚨 ERREUR: onClimateZoneChange non défini!');
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Économie Thermique Annuelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ZONE THERMIQUE - avec debug */}
          <div className="space-y-2">
            <Label>Zone Thermique (G: {climateZoneCoefficients[climateZone || ""] || '?'})</Label>
            <Select 
              value={climateZone}
              onValueChange={handleClimateZoneChange}
            >
              <SelectTrigger>
                <SelectValue>
                  {climateZone} - Coefficient {climateZoneCoefficients[climateZone || ""]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {Object.entries(climateZoneCoefficients).map(([zone, coef]) => (
                  <SelectItem key={zone} value={zone}>
                    {zone} - G={coef}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Debug très détaillé */}
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border-2 border-red-200">
              🚨 DEBUG ZONE:<br/>
              Reçue: "{climateZone}" (len: {climateZone?.length})<br/>
              Type: {typeof climateZone}<br/>
              Coefficient: {climateZoneCoefficients[climateZone || ""] || 'NON TROUVÉ'}<br/>
              CAE = {surfaceArea} × {(uValueBefore - uValueAfter).toFixed(2)} × {climateZoneCoefficients[climateZone || ""] || '?'} = {annualSavings.toFixed(1)} kWh/an
            </div>

            {/* Info géolocalisation si disponible */}
            {climateMethod && climateReferenceCity && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                📍 Déterminé automatiquement: {climateReferenceCity}
                {climateDistance && ` (${climateDistance}km)`}
                <br />
                Confiance: {climateConfidence}%
              </div>
            )}
          </div>
          
          <DelegateSelector
            delegate={delegate}
            onDelegateChange={setDelegate}
          />
        </div>
        
        <CalculationsDisplay
          annualSavings={annualSavings}
          projectPrice={projectPrice}
          pricePerSqm={pricePerSqm}
        />
        
        <CherryOption
          cherryEnabled={cherryEnabled}
          onCherryEnabledChange={setCherryEnabled}
          pricePerSqm={pricePerSqm}
          projectPrice={projectPrice}
          cherryPricePerSqm={cherryPricePerSqm}
          cherryProjectPrice={cherryProjectPrice}
          totalPricePerSqm={totalPricePerSqm}
          totalProjectPrice={totalProjectPrice}
        />
      </CardContent>
    </Card>
  );
};

export default ThermalEconomySection;
