
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cherry, CheckCircle2 } from "lucide-react";

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

// Delegate multipliers
const delegateMultipliers = {
  "Eiffage": 0.130,
  "GreenFlex": 0.115,
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
  const [cherryEnabled, setCherryEnabled] = useState(false);
  const [delegate, setDelegate] = useState<"Eiffage" | "GreenFlex">("Eiffage");
  const [selectedClimateZone, setSelectedClimateZone] = useState(climateZone);
  
  // 🔥 SYNCHRONISATION AUTOMATIQUE avec la zone climatique déterminée
  useEffect(() => {
    if (climateZone && climateZone !== selectedClimateZone) {
      console.log('🌍 Synchronisation automatique zone climatique dans ThermalEconomySection:', climateZone);
      setSelectedClimateZone(climateZone);
      // Propager immédiatement le changement pour mettre à jour le coefficient G
      if (onClimateZoneChange) {
        onClimateZoneChange(climateZone);
      }
    }
  }, [climateZone, selectedClimateZone, onClimateZoneChange]);

  // Get coefficient G based on selected climate zone
  const gCoefficient = climateZoneCoefficients[selectedClimateZone] || 46;
  
  // Helper function to get coefficient for any zone
  const getCoefficient = (zone: string) => climateZoneCoefficients[zone] || 46;
  
  // Get multiplier based on delegate
  const multiplier = delegateMultipliers[delegate];
  
  // Calculate annual savings in kWh/year
  const annualSavings = surfaceArea * (uValueBefore - uValueAfter) * gCoefficient;
  
  // Calculate project price in EUR
  const projectPrice = annualSavings * multiplier;
  
  // Calculate price per m²
  const pricePerSqm = projectPrice / surfaceArea;
  
  // Calculate Cherry prices (10%)
  const cherryPricePerSqm = pricePerSqm * 0.1;
  const cherryProjectPrice = projectPrice * 0.1;
  
  // Total prices with Cherry
  const totalPricePerSqm = pricePerSqm + cherryPricePerSqm;
  const totalProjectPrice = projectPrice + cherryProjectPrice;

  // 🔧 Gestionnaire de changement optimisé avec propagation
  const handleClimateZoneChange = (zone: string) => {
    console.log('🌍 Changement zone climatique manuel depuis ThermalEconomySection:', zone);
    setSelectedClimateZone(zone);
    
    // Propager le changement vers le parent pour synchroniser avec les autres composants
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  // Afficher l'indicateur de confiance comme dans l'image
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

  // Afficher la description et les informations automatiques
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

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Économie Thermique Annuelle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Climate Zone Selector avec coefficient G visible */}
          <div className="space-y-2">
            <Label htmlFor="climate-zone" className="flex items-center gap-2">
              Zone Climatique
              {selectedClimateZone && (
                <span className="font-normal text-muted-foreground text-sm">
                  (G: {getCoefficient(selectedClimateZone)})
                </span>
              )}
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedClimateZone}
                  onValueChange={handleClimateZoneChange}
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
          
          {/* Delegate Selection */}
          <div className="space-y-2">
            <Label htmlFor="delegate">Sujet délégataire</Label>
            <Select
              value={delegate}
              onValueChange={(value: "Eiffage" | "GreenFlex") => setDelegate(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un délégataire" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="Eiffage">Eiffage (0,130)</SelectItem>
                <SelectItem value="GreenFlex">GreenFlex (0,115)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Calculations Display */}
        <div className="space-y-2 bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">CAE projet</div>
              <div className="font-medium">{annualSavings.toFixed(2)} kWh/an</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Prix projet</div>
              <div className="font-medium">{projectPrice.toFixed(2)} €</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Prix au m²</div>
              <div className="font-medium">{pricePerSqm.toFixed(2)} €/m²</div>
            </div>
          </div>
        </div>
        
        {/* Cherry Option */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="cherry"
            checked={cherryEnabled}
            onCheckedChange={(checked) => setCherryEnabled(checked === true)}
          />
          <Label htmlFor="cherry" className="flex items-center cursor-pointer">
            <Cherry className="h-4 w-4 mr-2 text-red-500" />
            Cerise
          </Label>
        </div>
        
        {/* Cherry Calculations */}
        {cherryEnabled && (
          <div className="space-y-2 bg-rose-50 p-4 rounded-md border border-rose-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Prix Cerise (10% du prix au m²)</div>
                <div className="font-medium">{cherryPricePerSqm.toFixed(2)} €/m²</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Prix Cerise (10% du prix projet)</div>
                <div className="font-medium">{cherryProjectPrice.toFixed(2)} €</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Prix au m² + Cerise</div>
                <div className="font-medium">
                  {pricePerSqm.toFixed(2)} + {cherryPricePerSqm.toFixed(2)} = {totalPricePerSqm.toFixed(2)} €/m²
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Prix projet + Cerise</div>
                <div className="font-medium">
                  {projectPrice.toFixed(2)} + {cherryProjectPrice.toFixed(2)} = {totalProjectPrice.toFixed(2)} €
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThermalEconomySection;
