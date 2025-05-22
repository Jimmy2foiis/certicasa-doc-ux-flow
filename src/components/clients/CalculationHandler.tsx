
import { useToast } from "@/components/ui/use-toast";
import ProjectCalculationView from "./ProjectCalculationView";

interface CalculationHandlerProps {
  clientId: string;
  projectId?: string;
  clientName: string;
  clientAddress: string;
  onBack: () => void;
}

const CalculationHandler = ({
  clientId,
  projectId,
  clientName,
  clientAddress,
  onBack
}: CalculationHandlerProps) => {
  const { toast } = useToast();
  
  // Mock data for saved calculations - this would be fetched from the API in a real app
  const savedCalculations = [];
  
  // Prepare client data object
  const client = {
    id: clientId,
    name: clientName,
    address: clientAddress,
    climateZone: "B3" // Default climate zone, could be fetched from API
  };
  
  // Fonction pour sauvegarder un nouveau calcul
  const saveCalculation = (calculationData: any) => {
    try {
      // Générer un ID unique pour ce calcul
      const calculationId = `calc_${Date.now()}`;
      const projectNumber = savedCalculations.length + 1;
      
      const newCalculation = {
        id: calculationId,
        projectId: projectId || `project_${projectNumber}`,
        projectName: `Réhabilitation Énergétique #${projectNumber}`,
        clientId: clientId,
        type: calculationData.projectType || "RES010",
        surface: parseFloat(calculationData.surfaceArea) || 120,
        date: new Date().toLocaleDateString('fr-FR'),
        improvement: calculationData.improvementPercent || 35,
        calculationData: calculationData
      };
      
      // Récupérer tous les calculs existants
      const savedData = localStorage.getItem('saved_calculations');
      let allCalculations = [];
      
      if (savedData) {
        allCalculations = JSON.parse(savedData);
      }
      
      // Ajouter ou mettre à jour le calcul
      const existingIndex = allCalculations.findIndex((c: any) => 
        c.clientId === clientId && c.projectId === newCalculation.projectId);
      
      if (existingIndex >= 0) {
        allCalculations[existingIndex] = newCalculation;
      } else {
        allCalculations.push(newCalculation);
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));
      
      // Afficher un message de succès
      toast({
        title: "Calcul sauvegardé",
        description: "Les données du calcul ont été enregistrées avec succès.",
        duration: 3000
      });
      
      // Retourner à la liste des calculs
      onBack();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du calcul:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du calcul.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  return (
    <ProjectCalculationView 
      client={client} 
      clientId={clientId}
      currentProjectId={projectId}
      savedCalculations={savedCalculations}
      onBack={onBack}
      onSave={saveCalculation}
    />
  );
};

export default CalculationHandler;
