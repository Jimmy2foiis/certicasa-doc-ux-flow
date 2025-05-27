import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThermalEconomyCalculations } from "@/hooks/useThermalEconomyCalculations";
import DelegateSelector from "./thermal-economy/DelegateSelector";
import CalculationsDisplay from "./thermal-economy/CalculationsDisplay";
import CherryOption from "./thermal-economy/CherryOption";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { FileText } from "lucide-react";

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
  
  // Assurer que la zone climatique est valide
  const validClimateZone = climateZone && climateZoneCoefficients[climateZone] ? climateZone : "C3";
  
  console.log('🌡️ ThermalEconomySection - Zone reçue:', climateZone);
  console.log('🌡️ ThermalEconomySection - Zone validée:', validClimateZone);
  console.log('🌡️ ThermalEconomySection - Coefficient:', climateZoneCoefficients[validClimateZone]);

  // Synchroniser automatiquement avec la zone du parent
  useEffect(() => {
    if (climateZone && climateZone !== validClimateZone) {
      console.log('🔄 ThermalEconomySection - Synchronisation automatique vers zone valide:', validClimateZone);
    }
  }, [climateZone, validClimateZone]);

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
    climateZone: validClimateZone
  });

  const handleClimateZoneChange = (zone: string) => {
    console.log('🌡️ ThermalEconomySection - Changement manuel vers:', zone);
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  const handleGenerateInvoice = () => {
    console.log('Génération de facture demandée');
    // Logique de génération de facture à implémenter
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Bouton Générer Facture */}
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerateInvoice}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md"
          size="lg"
        >
          <FileText className="h-5 w-5 mr-2" />
          Générer Facture
        </Button>
      </div>

      {/* Carte Économie Thermique */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Économie Thermique Annuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zone Thermique (G: {gCoefficient})</Label>
              <Select 
                value={validClimateZone}
                onValueChange={handleClimateZoneChange}
              >
                <SelectTrigger>
                  <SelectValue>
                    {validClimateZone} - Coefficient {gCoefficient}
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
    </div>
  );
};

export default ThermalEconomySection;
