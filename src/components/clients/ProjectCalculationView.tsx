
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCalculation from "../calculations/ProjectCalculation";

interface ProjectCalculationViewProps {
  client: any;
  clientId: string;
  currentProjectId: string | null;
  savedCalculations: Array<{
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
  onBack: () => void;
  onSave: (calculationData: any) => void;
}

const ProjectCalculationView = ({ 
  client, 
  clientId, 
  currentProjectId, 
  savedCalculations, 
  onBack, 
  onSave 
}: ProjectCalculationViewProps) => {
  // Find the calculation data if we're editing an existing calculation
  const calculationData = currentProjectId
    ? savedCalculations.find(c => c.projectId === currentProjectId)?.calculationData
    : undefined;
    
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-xl font-semibold">
          {currentProjectId 
            ? `Modification du calcul pour ${client.name}` 
            : `Nouveau calcul pour ${client.name}`}
        </h2>
      </div>
      <ProjectCalculation 
        clientId={clientId} 
        projectId={currentProjectId}
        savedData={calculationData}
        onSave={onSave}
      />
    </div>
  );
};

export default ProjectCalculationView;
