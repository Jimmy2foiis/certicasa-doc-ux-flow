
import ProjectCalculation from "../calculations/ProjectCalculation";
import { useCalculationEventEmitter } from "@/hooks/useCalculationEvents";
import { useToast } from "@/components/ui/use-toast";

interface CalculationsTabProps {
  clientId: string;
  clientName?: string;
  clientAddress?: string;
  // Zone géolocalisée réelle
  geolocatedClimateZone?: string;
  climateData?: {
    confidence?: number;
    method?: string;
    referenceCity?: string;
    distance?: number;
    description?: string;
  };
  savedCalculations?: Array<{
    id: string;
    projectId: string;
    projectName: string;
    clientId: string;
    type: string;
    surface: number;
    date: string;
    improvement: number;
    calculationData: any;
  }>;
  onOpenCalculation: (calculation: any) => void;
  onCreateNewCalculation: () => void;
}

const CalculationsTab = ({ 
  clientId, 
  clientName = "Client",
  clientAddress = "",
  geolocatedClimateZone,
  climateData,
  savedCalculations = [],
  onOpenCalculation, 
  onCreateNewCalculation 
}: CalculationsTabProps) => {
  const { toast } = useToast();
  const { emitCalculationSaved } = useCalculationEventEmitter();

  const calculations = Array.isArray(savedCalculations) ? savedCalculations : [];

  // Utiliser uniquement la zone géolocalisée, par défaut C3 si pas disponible
  const effectiveClimateZone = geolocatedClimateZone || "C3";

  console.log('🌍 CalculationsTab - Zone géolocalisée:', geolocatedClimateZone);
  console.log('🌍 CalculationsTab - Zone effective utilisée:', effectiveClimateZone);

  const handleSave = (calculationData: any) => {
    try {
      const calculationId = `calc_${Date.now()}`;
      const projectNumber = calculations.length + 1;

      const newCalculation = {
        id: calculationId,
        projectId: `project_${projectNumber}`,
        projectName: `Réhabilitation Énergétique #${projectNumber}`,
        clientId: clientId,
        type: calculationData.projectType || 'RES020',
        surface: parseFloat(calculationData.surfaceArea) || 120,
        date: new Date().toLocaleDateString('fr-FR'),
        improvement: calculationData.improvementPercent || 35,
        calculationData: calculationData,
      };

      const savedData = localStorage.getItem('saved_calculations');
      let allCalculations: any[] = [];

      if (savedData) {
        allCalculations = JSON.parse(savedData);
      }

      allCalculations.push(newCalculation);
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));

      console.log('Calcul sauvegardé avec succès:', newCalculation);
      
      // Emit event to notify other components
      emitCalculationSaved(newCalculation);
      
      toast({
        title: "Calcul sauvegardé",
        description: `Le calcul thermique a été sauvegardé avec succès. Surface: ${newCalculation.surface}m², Amélioration: ${newCalculation.improvement}%`,
      });
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du calcul:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le calcul.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <ProjectCalculation 
        clientId={clientId}
        clientName={clientName}
        clientAddress={clientAddress}
        onSave={handleSave}
        realClimateZone={effectiveClimateZone}
        clientClimateConfidence={climateData?.confidence}
        clientClimateMethod={climateData?.method}
        clientClimateReferenceCity={climateData?.referenceCity}
        clientClimateDistance={climateData?.distance}
        clientClimateDescription={climateData?.description}
        projectName={`Calcul thermique pour ${clientName}`}
        geolocatedClimateZone={geolocatedClimateZone}
      />
    </div>
  );
};

export default CalculationsTab;
