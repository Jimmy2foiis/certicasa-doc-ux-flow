
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTabContent } from "./DocumentsTabContent";
import SignaturesTabContent from "./SignaturesTabContent";
import { Card } from "@/components/ui/card";
import BillingTab from "./BillingTab";
import DocumentsTab from "./documents/DocumentsTab";
import ProjectCalculation from "../calculations/ProjectCalculation";

interface ClientTabsContainerProps {
  client: any;
  clientId: string;
  savedCalculations: any[];
  onNewCalculation: () => void;
  onEditCalculation: (projectId: string) => void;
  onDeleteCalculation: (projectId: string) => void;
  onBack: () => void;
}

export const ClientTabsContainer = ({ 
  client,
  clientId,
  savedCalculations,
  onNewCalculation,
  onEditCalculation,
  onDeleteCalculation,
  onBack
}: ClientTabsContainerProps) => {
  const [currentTab, setCurrentTab] = useState("calculations");

  const handleSave = (calculationData: any) => {
    console.log('Calcul sauvegardé:', calculationData);
    // Logic to save calculation
  };

  return (
    <div className="space-y-6">
      {/* Onglets */}
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
              clientClimateZone={client?.climateZone || "C3"}
              clientName={client?.name}
              clientAddress={client?.address}
              projectName={`Calcul thermique pour ${client?.name}`}
              clientData={{
                name: client?.name || '',
                address: client?.address || '',
                nif: client?.nif || '',
                phone: client?.phone || '',
                email: client?.email || ''
              }}
            />
          </TabsContent>

          <TabsContent value="documents" className="p-4">
            <DocumentsTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="billing" className="p-4">
            <BillingTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="photos" className="p-4">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">Photos de Chantier</h3>
              <p className="text-gray-600 mb-4">
                Gestion des photos avant/après travaux pour le client {client?.name}
              </p>
              <p className="text-sm text-gray-500">
                Module en développement - Upload et organisation des photos de chantier
              </p>
            </div>
          </TabsContent>

          <TabsContent value="signatures" className="p-4">
            <SignaturesTabContent clientId={clientId} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
