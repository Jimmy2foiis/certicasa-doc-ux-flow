
// Import the necessary components and types
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ThermalEconomySectionProps {
  beforeEnergy: number;
  afterEnergy: number;
  moneySaved: number;
  co2Saved: number;
  showSwitches?: boolean;
}

const ThermalEconomySection = ({
  beforeEnergy,
  afterEnergy,
  moneySaved,
  co2Saved,
  showSwitches = true,
}: ThermalEconomySectionProps) => {
  const [showExtraSavings, setShowExtraSavings] = useState(true);
  const [includeEcoCheck, setIncludeEcoCheck] = useState(true);

  // Calculate the energy improvement percentage
  const energyImprovement = beforeEnergy > 0 
    ? ((beforeEnergy - afterEnergy) / beforeEnergy) * 100 
    : 0;

  // Handle the switch change with proper typing
  const handleExtraSavingsChange = (checked: boolean) => {
    setShowExtraSavings(checked);
  };

  // Handle the eco check switch change with proper typing
  const handleEcoCheckChange = (checked: boolean) => {
    setIncludeEcoCheck(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Économies & Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Consommation avant</div>
              <div className="text-xl font-semibold">{beforeEnergy.toFixed(1)} kWh/m²/an</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">Amélioration</div>
              <div className="text-lg font-bold text-green-600">{energyImprovement.toFixed(1)}%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Consommation après</div>
              <div className="text-xl font-semibold">{afterEnergy.toFixed(1)} kWh/m²/an</div>
            </div>
          </div>

          <Separator />
          
          {showSwitches && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-extra-savings" className="cursor-pointer">
                  Afficher économies supplémentaires
                </Label>
                <Switch
                  id="show-extra-savings"
                  checked={showExtraSavings}
                  onCheckedChange={handleExtraSavingsChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-eco-check" className="cursor-pointer">
                  Inclure éco-chèque
                </Label>
                <Switch
                  id="include-eco-check"
                  checked={includeEcoCheck}
                  onCheckedChange={handleEcoCheckChange}
                />
              </div>
            </div>
          )}
          
          {showExtraSavings && (
            <>
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Économies financières</div>
                  <div className="text-xl font-semibold">{moneySaved.toFixed(2)} €/an</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Réduction CO₂</div>
                  <div className="text-xl font-semibold">{co2Saved.toFixed(2)} kg/an</div>
                </div>
              </div>
              
              {includeEcoCheck && (
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="text-sm font-medium text-green-800">Éligible à l'éco-chèque énergie</div>
                  <div className="text-xs text-green-700 mt-1">
                    L'amélioration de performance énergétique permet de bénéficier d'aides
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThermalEconomySection;
