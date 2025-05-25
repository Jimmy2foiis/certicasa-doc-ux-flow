
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CalculationActionsWithBilling from "./CalculationActionsWithBilling";
import ProjectInfoSection from "./ProjectInfoSection";
import { CalculationData } from "@/hooks/useCalculationState";
import { useEffect, useState } from "react";

interface CalculationHeaderProps {
  calculationData: CalculationData;
  onSave?: (calculationData: any) => void;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
  clientData?: {
    name: string;
    nif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  floorType?: string;
  climateZone?: string;
}

const CalculationHeader = ({ 
  calculationData,
  onSave,
  clientName,
  clientAddress,
  projectName,
  clientData,
  floorType = "Bois",
  climateZone = "C3"
}: CalculationHeaderProps) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Simuler l'indicateur d'auto-sauvegarde basé sur les changements des données
  useEffect(() => {
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, [calculationData.beforeLayers, calculationData.afterLayers]);

  return (
    <div>
      {/* 3️⃣ Section Informations Projet - reçoit zoneClimatique */}
      <ProjectInfoSection 
        surfaceArea={calculationData.surfaceArea}
        roofArea={calculationData.roofArea}
        climateZone={climateZone}
        floorType={floorType}
      />
      
      {/* Header du calcul */}
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Module de Calcul
            {/* Indicateur d'auto-sauvegarde */}
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center gap-1 text-orange-600 text-xs">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-orange-600"></div>
                <span>Sauvegarde...</span>
              </div>
            )}
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <div className="rounded-full h-3 w-3 bg-green-600"></div>
                <span>Sauvegardé</span>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Saisissez les matériaux et épaisseurs pour calculer la résistance thermique
            {autoSaveStatus === 'saved' && (
              <span className="text-green-600 ml-2">• Modifications automatiquement sauvegardées</span>
            )}
          </CardDescription>
        </div>
        <CalculationActionsWithBilling 
          calculationData={calculationData}
          onSave={onSave}
          clientName={clientName}
          clientAddress={clientAddress}
          projectName={projectName}
          clientData={clientData}
        />
      </CardHeader>
    </div>
  );
};

export default CalculationHeader;
