import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInfoTab from "./ClientInfoTab";
import DocumentsTab from "./DocumentsTab";
import CalculationsTab from "./CalculationsTab";
import BillingTab from "./BillingTab";
import StatisticsTab from "./StatisticsTab";
import { ClientPlanning } from "./planning/ClientPlanning";

interface ClientDetailsTabsProps {
  clientId: string;
  client: any;
  clientAddress: string;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  loadingCadastral: boolean;
  coordinates?: any;
  savedCalculations: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShowCalculation: (projectId?: string) => void;
  onAddressChange: (newAddress: string) => void;
  onCoordinatesChange: (coordinates: any) => void;
  onRefreshCadastralData: () => Promise<void>;
}

const ClientDetailsTabs = ({
  clientId,
  clientAddress,
  client,
  utmCoordinates,
  cadastralReference,
  climateZone,
  apiSource,
  loadingCadastral,
  coordinates,
  savedCalculations,
  activeTab,
  setActiveTab,
  onShowCalculation,
  onAddressChange,
  onCoordinatesChange,
  onRefreshCadastralData
}: ClientDetailsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-6 mb-2">
        <TabsTrigger value="client-info" className="text-sm">Informations</TabsTrigger>
        <TabsTrigger value="documents" className="text-sm">Documents</TabsTrigger>
        <TabsTrigger value="calculations" className="text-sm">Calculs</TabsTrigger>
        <TabsTrigger value="planning" className="text-sm">Planning</TabsTrigger>
        <TabsTrigger value="billing" className="text-sm">Facturation</TabsTrigger>
        <TabsTrigger value="statistics" className="text-sm">Statistiques</TabsTrigger>
      </TabsList>
      
      <TabsContent value="client-info">
        <ClientInfoTab 
          client={client}
          utmCoordinates={utmCoordinates}
          cadastralReference={cadastralReference}
          climateZone={climateZone}
          apiSource={apiSource}
          loadingCadastral={loadingCadastral}
          coordinates={coordinates}
          onShowCalculation={onShowCalculation}
          onAddressChange={onAddressChange}
          onCoordinatesChange={onCoordinatesChange}
          onRefreshCadastralData={onRefreshCadastralData}
        />
      </TabsContent>
      
      <TabsContent value="documents">
        <DocumentsTab 
          clientId={clientId} 
          clientName={client?.name}
        />
      </TabsContent>
      
      <TabsContent value="calculations">
        <CalculationsTab 
          savedCalculations={savedCalculations} 
          onShowCalculation={onShowCalculation}
        />
      </TabsContent>

      <TabsContent value="planning">
        <ClientPlanning 
          clientId={clientId}
          clientName={client?.name}
        />
      </TabsContent>
      
      <TabsContent value="billing">
        <BillingTab clientId={clientId} />
      </TabsContent>
      
      <TabsContent value="statistics">
        <StatisticsTab clientId={clientId} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDetailsTabs;
