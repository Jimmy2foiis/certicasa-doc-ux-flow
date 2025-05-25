
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import ClientInfoSidebar from "./sidebar/ClientInfoSidebar";
import CalculationsTabContent from "./CalculationsTabContent";
import ProjectsTabContent from "./ProjectsTabContent";
import { DocumentsTabContent } from "./DocumentsTabContent";
import PhotosChantierTab from "./PhotosChantierTab";
import BillingTab from "./BillingTab";
import StatisticsTab from "./StatisticsTab";
import SignaturesTabContent from "./SignaturesTabContent";
import ProjectCalculationView from "./ProjectCalculationView";

interface ClientTabsContainerProps {
  client: any;
  clientId: string;
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
  onNewCalculation: () => void;
  onEditCalculation: (projectId: string) => void;
  onDeleteCalculation: (projectId: string) => void;
  onBack: () => void;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  climateZone?: string;
  onClimateZoneChange?: (value: string) => void;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
}

export const ClientTabsContainer = ({ 
  client, 
  clientId, 
  savedCalculations, 
  onNewCalculation, 
  onEditCalculation, 
  onDeleteCalculation, 
  onBack,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois",
  climateZone = "C3",
  onClimateZoneChange
}: ClientTabsContainerProps) => {
  // États pour la vue de calcul
  const [showCalculation, setShowCalculation] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  
  // États pour les valeurs modifiables dans la sidebar
  const [currentSurfaceArea, setCurrentSurfaceArea] = useState(surfaceArea);
  const [currentRoofArea, setCurrentRoofArea] = useState(roofArea);
  const [currentFloorType, setCurrentFloorType] = useState(floorType);
  const [currentClimateZone, setCurrentClimateZone] = useState(climateZone);

  const handleShowCalculation = (projectId?: string) => {
    setCurrentProjectId(projectId || null);
    setShowCalculation(true);
  };

  const handleBackFromCalculation = () => {
    setShowCalculation(false);
    setCurrentProjectId(null);
  };

  const handleSaveCalculation = (calculationData: any) => {
    console.log("Saving calculation:", calculationData);
    // Ici vous pouvez implémenter la logique de sauvegarde
  };

  // 🎯 Gestionnaire de changement de zone climatique
  const handleClimateZoneChangeInternal = (value: string) => {
    console.log("🔄 Zone climatique mise à jour dans ClientTabsContainer:", value);
    setCurrentClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };

  // Si on affiche le calcul, montrer la vue de calcul
  if (showCalculation) {
    return (
      <ProjectCalculationView
        client={client}
        clientId={clientId}
        currentProjectId={currentProjectId}
        savedCalculations={savedCalculations}
        onBack={handleBackFromCalculation}
        onSave={handleSaveCalculation}
        surfaceArea={currentSurfaceArea}
        roofArea={currentRoofArea}
        floorType={currentFloorType}
        onSurfaceAreaChange={setCurrentSurfaceArea}
        onRoofAreaChange={setCurrentRoofArea}
        onFloorTypeChange={setCurrentFloorType}
        onClimateZoneChange={handleClimateZoneChangeInternal}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Informations du client</CardTitle>
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Sidebar d'informations du client */}
        <ClientInfoSidebar 
          client={client}
          onSurfaceAreaChange={setCurrentSurfaceArea}
          onRoofAreaChange={setCurrentRoofArea}
          onFloorTypeChange={setCurrentFloorType}
          onClimateZoneChange={handleClimateZoneChangeInternal}
          currentSurfaceArea={currentSurfaceArea}
          currentRoofArea={currentRoofArea}
          currentFloorType={currentFloorType}
          currentClimateZone={currentClimateZone}
        />
        
        {/* Onglets du client */}
        <div className="mt-6">
          <Tabs defaultValue="calculations" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="calculations">Calculs</TabsTrigger>
              <TabsTrigger value="projects">Projets</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="photos">Photos Chantier</TabsTrigger>
              <TabsTrigger value="billing">Facturation</TabsTrigger>
              <TabsTrigger value="statistics">Statistiques</TabsTrigger>
              <TabsTrigger value="signatures">Signatures</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculations" className="mt-4">
              <CalculationsTabContent 
                savedCalculations={savedCalculations}
                onNewCalculation={() => handleShowCalculation()}
                onEditCalculation={handleShowCalculation}
                onDeleteCalculation={onDeleteCalculation}
              />
            </TabsContent>
            
            <TabsContent value="projects" className="mt-4">
              <ProjectsTabContent clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <DocumentsTabContent clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="photos" className="mt-4">
              <PhotosChantierTab clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="billing" className="mt-4">
              <BillingTab clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-4">
              <StatisticsTab clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="signatures" className="mt-4">
              <SignaturesTabContent clientId={clientId} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
