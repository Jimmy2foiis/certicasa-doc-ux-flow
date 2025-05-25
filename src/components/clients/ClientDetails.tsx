
import { useState } from "react";
import { useClientData } from "@/hooks/useClientData";
import { useSavedCalculations } from "@/hooks/useSavedCalculations";
import ClientInfoSidebar from "./sidebar/ClientInfoSidebar";
import ClientTabsContainer from "./ClientTabsContainer";
import ProjectCalculationView from "./ProjectCalculationView";

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetails = ({ clientId, onBack }: ClientDetailsProps) => {
  const [currentView, setCurrentView] = useState<"details" | "calculation">("details");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [surfaceArea, setSurfaceArea] = useState("70");
  const [roofArea, setRoofArea] = useState("85");
  
  const { client, loading } = useClientData(clientId);
  const { savedCalculations, saveCalculation, deleteCalculation } = useSavedCalculations(clientId);

  const handleNewCalculation = () => {
    setCurrentProjectId(null);
    setCurrentView("calculation");
  };

  const handleEditCalculation = (projectId: string) => {
    setCurrentProjectId(projectId);
    setCurrentView("calculation");
  };

  const handleBackFromCalculation = () => {
    setCurrentView("details");
    setCurrentProjectId(null);
  };

  const handleSaveCalculation = (calculationData: any) => {
    saveCalculation(calculationData, currentProjectId);
    setCurrentView("details");
    setCurrentProjectId(null);
  };

  const handleSurfaceAreaChange = (value: string) => {
    setSurfaceArea(value);
  };

  const handleRoofAreaChange = (value: string) => {
    setRoofArea(value);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!client) {
    return <div>Client non trouvé</div>;
  }

  if (currentView === "calculation") {
    return (
      <ProjectCalculationView
        client={client}
        clientId={clientId}
        currentProjectId={currentProjectId}
        savedCalculations={savedCalculations}
        onBack={handleBackFromCalculation}
        onSave={handleSaveCalculation}
        surfaceArea={surfaceArea}
        roofArea={roofArea}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ClientInfoSidebar 
        client={client} 
        onSurfaceAreaChange={handleSurfaceAreaChange}
        onRoofAreaChange={handleRoofAreaChange}
      />
      <ClientTabsContainer
        client={client}
        clientId={clientId}
        savedCalculations={savedCalculations}
        onNewCalculation={handleNewCalculation}
        onEditCalculation={handleEditCalculation}
        onDeleteCalculation={deleteCalculation}
        onBack={onBack}
      />
    </div>
  );
};

export default ClientDetails;
