
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThermalEconomyCalculations } from "@/hooks/useThermalEconomyCalculations";
import { ThermalZoneSync } from "../thermal/ThermalZoneSync";
import DelegateSelector from "./thermal-economy/DelegateSelector";
import CalculationsDisplay from "./thermal-economy/CalculationsDisplay";
import CherryOption from "./thermal-economy/CherryOption";
import { useEffect } from "react";

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
  
  // 🔴 DIAGNOSTIC COMPLET - TOUTES LES VALEURS D'ENTRÉE
  console.log('🔴 DIAGNOSTIC ThermalEconomySection - VALEURS D\'ENTRÉE:');
  console.log('  📊 surfaceArea:', surfaceArea);
  console.log('  📊 uValueBefore:', uValueBefore);
  console.log('  📊 uValueAfter:', uValueAfter);
  console.log('  🌍 climateZone (prop):', climateZone);
  console.log('  🏗️ projectType:', projectType);
  console.log('  ℹ️ climateConfidence:', climateConfidence);
  console.log('  ℹ️ climateMethod:', climateMethod);
  console.log('  ℹ️ climateReferenceCity:', climateReferenceCity);
  console.log('  ℹ️ climateDistance:', climateDistance);

  const {
    cherryEnabled,
    setCherryEnabled,
    delegate,
    setDelegate,
    selectedClimateZone,
    setSelectedClimateZone,
    gCoefficient,
    getCoefficient,
    annualSavings,
    projectPrice,
    pricePerSqm,
    cherryPricePerSqm,
    cherryProjectPrice,
    totalPricePerSqm,
    totalProjectPrice,
    handleClimateZoneChange
  } = useThermalEconomyCalculations({
    surfaceArea,
    uValueBefore,
    uValueAfter,
    climateZone,
    onClimateZoneChange
  });

  // 🔴 DIAGNOSTIC COMPLET - VALEURS DU HOOK
  console.log('🔴 DIAGNOSTIC useThermalEconomyCalculations - VALEURS DE SORTIE:');
  console.log('  🌍 selectedClimateZone:', selectedClimateZone);
  console.log('  📈 gCoefficient:', gCoefficient);
  console.log('  👥 delegate:', delegate);
  console.log('  🍒 cherryEnabled:', cherryEnabled);
  console.log('  💰 annualSavings:', annualSavings);
  console.log('  💰 projectPrice:', projectPrice);
  console.log('  💰 pricePerSqm:', pricePerSqm);
  console.log('  💰 cherryPricePerSqm:', cherryPricePerSqm);
  console.log('  💰 totalProjectPrice:', totalProjectPrice);

  // 🔄 SYNCHRONISATION DIRECTE avec la géolocalisation
  useEffect(() => {
    console.log('🔄 SYNCHRONISATION - climateZone changé:', climateZone);
    // Si on reçoit une zone de ClimateZoneDisplay, on l'utilise
    if (climateZone) {
      setSelectedClimateZone(climateZone);
      console.log('🔄 Zone Thermique synchronisée:', climateZone);
    }
  }, [climateZone, setSelectedClimateZone]);

  // Gestionnaire pour le nouveau composant de zone thermique
  const handleThermalZoneUpdate = (zone: string, coefficient: number) => {
    console.log(`📊 Mise à jour calculs avec Zone ${zone}, G=${coefficient}`);
    handleClimateZoneChange(zone);
    
    // Propager vers le parent (StatusBanner, etc.)
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  // 🔴 DIAGNOSTIC FINAL - CALCULS UTILISÉS
  console.log('🔴 DIAGNOSTIC FINAL - CALCULS UTILISÉS:');
  console.log('  📐 Formule CAE: Surface × (UBefore - UAfter) × G');
  console.log('  📐 Calcul détaillé:', `${surfaceArea} × (${uValueBefore} - ${uValueAfter}) × ${gCoefficient} = ${annualSavings}`);
  console.log('  📐 Delta U:', uValueBefore - uValueAfter);

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Économie Thermique Annuelle
        </CardTitle>
        
        {/* 🚨 PANNEAU DE DEBUG - VALEURS CRITIQUES */}
        <div className="my-4 p-4 bg-red-50 dark:bg-red-950 border-2 border-red-500 rounded-lg">
          <h3 className="font-bold text-red-700 dark:text-red-300 mb-3">
            🚨 DEBUG ThermalEconomySection - VALEURS EN TEMPS RÉEL
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Zones */}
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <div className="font-semibold text-red-600">ZONES:</div>
              <div>Zone reçue (prop): <span className="font-mono font-bold">{climateZone || 'AUCUNE'}</span></div>
              <div>Zone sélectionnée: <span className="font-mono font-bold">{selectedClimateZone || 'AUCUNE'}</span></div>
              <div>Synchronisées: <span className="font-bold">{climateZone === selectedClimateZone ? '✅ OUI' : '❌ NON'}</span></div>
            </div>
            
            {/* Coefficient G */}
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <div className="font-semibold text-red-600">COEFFICIENT G:</div>
              <div>G actuel: <span className="font-mono font-bold text-lg">{gCoefficient}</span></div>
              <div>G de {selectedClimateZone}: <span className="font-mono font-bold">{climateZoneCoefficients[selectedClimateZone] || 'ERREUR'}</span></div>
              <div>Correct: <span className="font-bold">{gCoefficient === climateZoneCoefficients[selectedClimateZone] ? '✅ OUI' : '❌ NON'}</span></div>
            </div>
            
            {/* Valeurs U */}
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <div className="font-semibold text-red-600">VALEURS U:</div>
              <div>U avant: <span className="font-mono font-bold">{uValueBefore}</span> W/m²·K</div>
              <div>U après: <span className="font-mono font-bold">{uValueAfter}</span> W/m²·K</div>
              <div>Delta U: <span className="font-mono font-bold">{(uValueBefore - uValueAfter).toFixed(3)}</span></div>
            </div>
            
            {/* Calculs */}
            <div className="p-2 bg-white dark:bg-gray-900 rounded">
              <div className="font-semibold text-red-600">CALCULS:</div>
              <div>Surface: <span className="font-mono font-bold">{surfaceArea}</span> m²</div>
              <div>CAE calculé: <span className="font-mono font-bold">{annualSavings}</span> kWh/an</div>
              <div>Prix/m²: <span className="font-mono font-bold">{pricePerSqm}</span> €</div>
            </div>
          </div>
          
          {/* Formule détaillée */}
          <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded">
            <div className="font-semibold">📐 FORMULE DÉTAILLÉE:</div>
            <div className="font-mono text-sm">
              CAE = {surfaceArea} × ({uValueBefore} - {uValueAfter}) × {gCoefficient}
            </div>
            <div className="font-mono text-sm">
              CAE = {surfaceArea} × {(uValueBefore - uValueAfter).toFixed(3)} × {gCoefficient} = <span className="font-bold text-lg">{annualSavings}</span> kWh/an
            </div>
          </div>
          
          {/* État de synchronisation */}
          <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
            <div className="font-semibold">🔄 SYNCHRONISATION:</div>
            <div className="text-sm">
              {climateZone === selectedClimateZone 
                ? '✅ Les zones sont synchronisées' 
                : `❌ DÉSYNCHRONISÉ: Reçu "${climateZone}" mais utilise "${selectedClimateZone}"`}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ThermalZoneSync
            geolocatedZone={climateZone}
            onCoefficientChange={handleThermalZoneUpdate}
          />
          
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
