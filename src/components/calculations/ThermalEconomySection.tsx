
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cherry } from "lucide-react";

// Climate zone coefficients mapping
export const climateZoneCoefficients: Record<string, number> = {
  "A3": 25,
  "B3": 32,
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
}

const ThermalEconomySection = ({ 
  surfaceArea, 
  uValueBefore, 
  uValueAfter, 
  climateZone = "C3",
  projectType
}: ThermalEconomySectionProps) => {
  const [cherryEnabled, setCherryEnabled] = useState(false);
  const [delegate, setDelegate] = useState<"Eiffage" | "GreenFlex">("Eiffage");
  
  // Get coefficient G based on climate zone - default to the given zone or C3 if not found
  const gCoefficient = climateZone && climateZoneCoefficients[climateZone] 
    ? climateZoneCoefficients[climateZone] 
    : 46; // Default to C3 coefficient if not found
  
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

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Économie Thermique Annuelle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Climate Zone */}
          <div className="space-y-2">
            <Label>Zone Climatique</Label>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{climateZone}</div>
              <span className="text-sm text-gray-500">(coefficient G: {gCoefficient})</span>
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
              <SelectContent>
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
              <div className="text-sm text-gray-500">Économie annuelle</div>
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
