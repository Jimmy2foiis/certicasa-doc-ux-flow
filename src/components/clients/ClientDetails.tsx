
import { useState } from "react";
import { useClientData } from "@/hooks/useClientData";
import { useSavedCalculations } from "@/hooks/useSavedCalculations";
import ClientInfoSidebar from "./sidebar/ClientInfoSidebar";
import { ClientTabsContainer } from "./ClientTabsContainer";
import ProjectCalculationView from "./ProjectCalculationView";
import ClientDetailsHeader from "./ClientDetailsHeader";

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetails = ({ clientId, onBack }: ClientDetailsProps) => {
  const [currentView, setCurrentView] = useState<"details" | "calculation">("details");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [surfaceArea, setSurfaceArea] = useState("70");
  const [roofArea, setRoofArea] = useState("85");
  
  const { client } = useClientData(clientId);
  const { savedCalculations } = useSavedCalculations(clientId);

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
    // Save calculation logic - for now just switch back to details view
    setCurrentView("details");
    setCurrentProjectId(null);
  };

  const handleDeleteCalculation = (projectId: string) => {
    // Delete calculation logic - for now just a placeholder
    console.log("Deleting calculation:", projectId);
  };

  const handleSurfaceAreaChange = (value: string) => {
    setSurfaceArea(value);
  };

  const handleRoofAreaChange = (value: string) => {
    setRoofArea(value);
  };

  // Mock document stats for the header
  const documentStats = {
    total: 8,
    generated: 5,
    missing: 3,
    error: 0
  };

  const handleViewMissingDocs = () => {
    // Logic to switch to documents tab
  };

  const handleDocumentGenerated = (documentId: string) => {
    console.log('Document généré:', documentId);
  };

  const handleClientUpdated = () => {
    console.log('Client mis à jour');
  };

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
      {/* Barre d'en-tête du client */}
      <ClientDetailsHeader 
        client={client}
        clientId={clientId}
        clientName={client?.name || "Client"}
        onBack={onBack}
        documentStats={documentStats}
        onViewMissingDocs={handleViewMissingDocs}
        onDocumentGenerated={handleDocumentGenerated}
        onClientUpdated={handleClientUpdated}
      />
      
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
        onDeleteCalculation={handleDeleteCalculation}
        onBack={onBack}
        surfaceArea={surfaceArea}
        roofArea={roofArea}
      />
    </div>
  );
};

export default ClientDetails;
