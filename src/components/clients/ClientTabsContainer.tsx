
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTabContent } from "./DocumentsTabContent";
import SignaturesTabContent from "./SignaturesTabContent";
import { Card } from "@/components/ui/card";
import BillingTab from "./BillingTab";
import DocumentsTab from "./documents/DocumentsTab";
import ProjectCalculation from "../calculations/ProjectCalculation";
import PhotosChantierTab from "./PhotosChantierTab";

interface ClientTabsContainerProps {
  client: any;
  clientId: string;
  savedCalculations: any[];
  onNewCalculation: () => void;
  onEditCalculation: (projectId: string) => void;
  onDeleteCalculation: (projectId: string) => void;
  onBack: () => void;
  surfaceArea: string;
  roofArea: string;
  floorType: string;
  climateZone?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

export const ClientTabsContainer = ({ 
  client,
  clientId,
  savedCalculations,
  onNewCalculation,
  onEditCalculation,
  onDeleteCalculation,
  onBack,
  surfaceArea,
  roofArea,
  floorType,
  climateZone,
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ClientTabsContainerProps) => {
  const [currentTab, setCurrentTab] = useState("calculations");

  const handleSave = (calculationData: any) => {
    console.log('Calcul sauvegardé:', calculationData);
    // Logic to save calculation
  };

  const handleClimateZoneChangeFromCalculation = (zone: string) => {
    console.log('🔄 Zone climatique mise à jour depuis les calculs:', zone);
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <Tabs defaultValue="calculations" onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-5 bg-muted/20">
            <TabsTrigger 
              value="calculations" 
              className={`${currentTab === "calculations" ? "bg-primary text-primary-foreground" : ""} transition-all`}
            >
              Calculs
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className={`${currentTab === "documents" ? "bg-primary text-primary-foreground" : ""} transition-all`}
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className={`${currentTab === "billing" ? "bg-primary text-primary-foreground" : ""} transition-all`}
            >
              Facturation
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className={`${currentTab === "photos" ? "bg-primary text-primary-foreground" : ""} transition-all`}
            >
              Photos Chantier
            </TabsTrigger>
            <TabsTrigger 
              value="signatures" 
              className={`${currentTab === "signatures" ? "bg-primary text-primary-foreground" : ""} transition-all`}
            >
              Signatures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculations" className="p-4">
            <ProjectCalculation 
              clientId={clientId}
              onSave={handleSave}
              realClimateZone={climateZone || client?.climateZone || "C3"}
              geolocatedClimateZone={climateZone}
              clientName={client?.name}
              clientAddress={client?.address}
              projectName={`Calcul thermique pour ${client?.name}`}
              surfaceArea={surfaceArea}
              roofArea={roofArea}
              floorType={floorType}
              onSurfaceAreaChange={onSurfaceAreaChange}
              onRoofAreaChange={onRoofAreaChange}
              onFloorTypeChange={onFloorTypeChange}
              onClimateZoneChange={handleClimateZoneChangeFromCalculation}
            />
          </TabsContent>

          <TabsContent value="documents" className="p-4">
            <DocumentsTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="billing" className="p-4">
            <BillingTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="photos" className="p-4">
            <PhotosChantierTab 
              clientId={clientId}
              clientName={client?.name}
              safetyCultureAuditId={client?.safetyCultureAuditId}
            />
          </TabsContent>

          <TabsContent value="signatures" className="p-4">
            <SignaturesTabContent clientId={clientId} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
