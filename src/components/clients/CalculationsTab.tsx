
import ProjectCalculation from "../calculations/ProjectCalculation";

interface CalculationsTabProps {
  clientId: string;
  clientName?: string;
  clientAddress?: string;
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
  savedCalculations = [],
  onOpenCalculation, 
  onCreateNewCalculation 
}: CalculationsTabProps) => {
  // S'assurer que savedCalculations est toujours un tableau
  const calculations = Array.isArray(savedCalculations) ? savedCalculations : [];

  // Fonction pour sauvegarder un calcul
  const handleSave = (calculationData: any) => {
    try {
      // Générer un ID unique pour ce calcul
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

      // Récupérer tous les calculs existants
      const savedData = localStorage.getItem('saved_calculations');
      let allCalculations: any[] = [];

      if (savedData) {
        allCalculations = JSON.parse(savedData);
      }

      // Ajouter le nouveau calcul
      allCalculations.push(newCalculation);

      // Sauvegarder dans le localStorage
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));

      console.log('Calcul sauvegardé avec succès:', newCalculation);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du calcul:', error);
    }
  };

  return (
    <div className="space-y-6">
      <ProjectCalculation 
        clientId={clientId}
        clientName={clientName}
        clientAddress={clientAddress}
        onSave={handleSave}
        clientClimateZone="B3"
        projectName={`Calcul thermique pour ${clientName}`}
        clientData={{
          name: clientName,
          address: clientAddress
        }}
      />
    </div>
  );
};

export default CalculationsTab;
