
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useClientData } from "@/hooks/useClientData";
import { useRequiredDocuments } from "@/hooks/useRequiredDocuments";

import ClientDetailsHeader from "./ClientDetailsHeader";
import ClientInfoSidebar from "./sidebar/ClientInfoSidebar";
import DocumentsTab from "./DocumentsTab";
import CalculationsTab from "./CalculationsTab";
import BillingTab from "./BillingTab";
import ProjectsTab from "./ProjectsTab";
import StatisticsTab from "./StatisticsTab";

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetails = ({ clientId, onBack }: ClientDetailsProps) => {
  const [activeTab, setActiveTab] = useState("calculations");
  const { client, savedCalculations } = useClientData(clientId);
  const { documentStats } = useRequiredDocuments(clientId);
  
  const handleViewMissingDocs = () => {
    setActiveTab("documents");
  };

  // Handler functions for calculations
  const handleOpenCalculation = (calculation: any) => {
    // Handle opening a calculation
    console.log("Opening calculation:", calculation);
  };

  const handleCreateNewCalculation = () => {
    // Handle creating a new calculation
    console.log("Creating new calculation");
  };

  // Make sure savedCalculations is always defined as an array
  const calculationsData = savedCalculations || [];
  
  console.log("ClientDetails - savedCalculations:", savedCalculations); // Debug log

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-2 pl-1"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      {/* Pass all required props to ClientDetailsHeader */}
      <ClientDetailsHeader 
        client={client}
        clientId={clientId}
        clientName={client?.name || "Client"}
        onBack={onBack}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Client Info Sidebar - Left Column */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3">
          <ClientInfoSidebar 
            client={client} 
            documentStats={documentStats}
            onViewMissingDocs={handleViewMissingDocs}
          />
        </div>

        {/* Tabs Content - Right Column */}
        <div className="col-span-12 md:col-span-9 lg:col-span-9">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="calculations">Calculs</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="billing">Facturation</TabsTrigger>
              <TabsTrigger value="projects">Photos Chantier</TabsTrigger>
              <TabsTrigger value="statistics">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculations" className="space-y-4">
              {/* Pass all required props to CalculationsTab */}
              <CalculationsTab 
                clientId={clientId} 
                clientName={client?.name}
                clientAddress={client?.address}
                savedCalculations={calculationsData}
                onOpenCalculation={handleOpenCalculation}
                onCreateNewCalculation={handleCreateNewCalculation}
              />
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <DocumentsTab clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              <BillingTab clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <ProjectsTab clientId={clientId} />
            </TabsContent>
            
            <TabsContent value="statistics" className="space-y-4">
              <StatisticsTab clientId={clientId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
