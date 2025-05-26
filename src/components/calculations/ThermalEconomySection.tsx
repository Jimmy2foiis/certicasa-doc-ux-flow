
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThermalEconomyCalculations } from "@/hooks/useThermalEconomyCalculations";
import DelegateSelector from "./thermal-economy/DelegateSelector";
import CalculationsDisplay from "./thermal-economy/CalculationsDisplay";
import CherryOption from "./thermal-economy/CherryOption";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

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
  
  // État local pour la zone sélectionnée dans le sélecteur
  const [selectedClimateZone, setSelectedClimateZone] = useState<string>("");

  // 🔄 Synchronisation automatique avec ClimateZoneDisplay
  useEffect(() => {
    if (climateZone && !selectedClimateZone) {
      setSelectedClimateZone(climateZone);
      console.log('✅ Zone thermique pré-remplie automatiquement avec:', climateZone);
    }
  }, [climateZone, selectedClimateZone]);

  // Zone effective utilisée pour les calculs
  const effectiveClimateZone = selectedClimateZone || climateZone;

  // 🔴 DEBUG - Vérifier la synchronisation
  console.error('🔴 THERMAL SYNC - Zone reçue (ClimateZoneDisplay):', climateZone);
  console.error('🔴 THERMAL SYNC - Zone sélectionnée (sélecteur):', selectedClimateZone);
  console.error('🔴 THERMAL SYNC - Zone effective (calculs):', effectiveClimateZone);

  const {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    gCoefficient,
    getCoefficient,
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
    climateZone: effectiveClimateZone,
    onClimateZoneChange
  });

  // 🔴 DEBUG - Vérifier les calculs avec la zone effective
  console.error('🔴 CALCUL THERMAL - Coefficient G utilisé:', gCoefficient);
  console.error('🔴 CALCUL THERMAL - CAE calculé:', annualSavings);
  console.error(`🔴 CALCUL THERMAL - Formule: ${surfaceArea} × (${uValueBefore.toFixed(3)} - ${uValueAfter.toFixed(3)}) × ${gCoefficient} = ${annualSavings.toFixed(1)}`);

  const handleClimateZoneChange = (zone: string) => {
    console.log('🎯 Changement manuel de zone thermique:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement vers le parent
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
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
          {/* ZONE THERMIQUE - avec synchronisation automatique */}
          <div className="space-y-2">
            <Label>Zone Thermique (G: {climateZoneCoefficients[effectiveClimateZone] || '?'})</Label>
            <Select 
              value={selectedClimateZone || climateZone || ""}
              onValueChange={handleClimateZoneChange}
            >
              <SelectTrigger>
                <SelectValue>
                  {effectiveClimateZone} - Coefficient {climateZoneCoefficients[effectiveClimateZone]}
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
            
            {/* Indicateur de synchronisation */}
            {effectiveClimateZone && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                ✅ Zone active: {effectiveClimateZone} (G={climateZoneCoefficients[effectiveClimateZone]})
                <br />
                → CAE = {surfaceArea} × {(uValueBefore - uValueAfter).toFixed(2)} × {climateZoneCoefficients[effectiveClimateZone]} = {annualSavings.toFixed(1)} kWh/an
              </div>
            )}

            {/* Info géolocalisation si disponible */}
            {climateMethod && climateReferenceCity && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
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
