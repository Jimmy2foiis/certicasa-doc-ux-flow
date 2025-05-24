
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useClientData } from "@/hooks/useClientData";
import { useRequiredDocuments } from "@/hooks/useRequiredDocuments";
import { useToast } from "@/components/ui/use-toast";

import ClientDetailsHeader from "./ClientDetailsHeader";
import ClientInfoSidebar from "./sidebar/ClientInfoSidebar";
import DocumentsTab from "./DocumentsTab";
import CalculationsTab from "./CalculationsTab";
import BillingTab from "./BillingTab";
import ProjectsTab from "./ProjectsTab";
import StatisticsTab from "./StatisticsTab";
import ProjectCalculation from "@/components/calculations/ProjectCalculation";

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetails = ({ clientId, onBack }: ClientDetailsProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("calculations");
  const [showCalculationTool, setShowCalculationTool] = useState(false);
  const [currentCalculationId, setCurrentCalculationId] = useState<string | null>(null);
  const { client, savedCalculations, refreshCadastralData } = useClientData(clientId);
  const { documentStats, refreshDocuments } = useRequiredDocuments(clientId);
  
  const handleViewMissingDocs = () => {
    setActiveTab("documents");
  };

  // Handler functions for calculations
  const handleOpenCalculation = (calculation: any) => {
    setCurrentCalculationId(calculation.id);
    setShowCalculationTool(true);
  };

  const handleCreateNewCalculation = () => {
    setCurrentCalculationId(null);
    setShowCalculationTool(true);
  };

  const handleBackFromCalculation = () => {
    setShowCalculationTool(false);
    setCurrentCalculationId(null);
  };

  const handleSaveCalculation = (calculationData: any) => {
    try {
      // Générer un ID unique pour ce calcul
      const calculationId = currentCalculationId || `calc_${Date.now()}`;
      const projectNumber = savedCalculations.length + 1;

      const newCalculation = {
        id: calculationId,
        projectId: currentCalculationId || `project_${projectNumber}`,
        projectName: `Réhabilitation Énergétique #${projectNumber}`,
        clientId: clientId,
        type: calculationData.projectType || 'RES010',
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

      // Ajouter ou mettre à jour le calcul
      const existingIndex = allCalculations.findIndex(
        (c: any) => c.clientId === clientId && c.id === calculationId,
      );

      if (existingIndex >= 0) {
        allCalculations[existingIndex] = newCalculation;
      } else {
        allCalculations.push(newCalculation);
      }

      // Sauvegarder dans le localStorage
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));

      toast({
        title: 'Calcul sauvegardé',
        description: 'Les données du calcul ont été enregistrées avec succès.',
        duration: 3000,
      });

      // Retourner à l'onglet calculs
      setShowCalculationTool(false);
      setCurrentCalculationId(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du calcul:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde du calcul.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  // Handle document generation completion
  const handleDocumentGenerated = (documentId: string) => {
    console.log("Document generated:", documentId);
    toast({
      title: "Document généré",
      description: `Le document a été généré avec succès (ID: ${documentId})`,
    });
    // Rafraîchir les statistiques des documents
    refreshDocuments?.();
    setActiveTab("documents");
  };

  // Handle client information updated
  const handleClientUpdated = () => {
    console.log("Client updated");
    toast({
      title: "Client mis à jour",
      description: "Les informations du client ont été mises à jour avec succès",
    });
    // Rafraîchir les données du client (y compris potentiellement les données cadastrales)
    refreshCadastralData?.();
  };

  // Make sure savedCalculations is always defined as an array
  const calculationsData = Array.isArray(savedCalculations) ? savedCalculations : [];
  
  console.log("ClientDetails - savedCalculations:", savedCalculations); // Debug log

  // Si l'outil de calcul est ouvert, l'afficher
  if (showCalculationTool) {
    const currentCalculation = currentCalculationId
      ? calculationsData.find(c => c.id === currentCalculationId)
      : null;

    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackFromCalculation}
          className="mb-2 pl-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux calculs
        </Button>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {currentCalculationId 
              ? `Modification du calcul pour ${client?.name}` 
              : `Nouveau calcul pour ${client?.name}`}
          </h2>
        </div>

        <ProjectCalculation 
          clientId={clientId} 
          projectId={currentCalculationId}
          savedData={currentCalculation?.calculationData}
          onSave={handleSaveCalculation}
          clientClimateZone={client?.climateZone || "C3"}
          clientName={client?.name}
          clientAddress={client?.address}
          projectName={currentCalculation?.projectName}
          clientData={{
            name: client?.name || '',
            nif: client?.nif || '',
            address: client?.address || '',
            phone: client?.phone || '',
            email: client?.email || ''
          }}
        />
      </div>
    );
  }

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
        documentStats={documentStats}
        onViewMissingDocs={handleViewMissingDocs}
        onBack={onBack}
        onDocumentGenerated={handleDocumentGenerated}
        onClientUpdated={handleClientUpdated}
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
