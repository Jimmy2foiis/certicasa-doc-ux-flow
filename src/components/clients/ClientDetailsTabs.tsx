import { 
  User, 
  Home, 
  FileText, 
  Receipt, 
  BarChart, 
  Calculator, 
  ImageIcon 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInfoTab from "./ClientInfoTab";
import ProjectsTab from "./ProjectsTab";
import CalculationsTab from "./CalculationsTab";
import DocumentsTab from "./DocumentsTab";
import BillingTab from "./BillingTab";
import StatisticsTab from "./StatisticsTab";
import PhotosChantierTab from "./PhotosChantierTab";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface ClientDetailsTabsProps {
  clientId: string;
  clientAddress: string;
  client: any;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  loadingCadastral: boolean;
  coordinates?: GeoCoordinates;
  savedCalculations: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShowCalculation: (projectId?: string) => void;
  onAddressChange: (address: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
  onRefreshCadastralData?: () => Promise<void>;
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
  
  // Fonction pour gérer la génération de documents et basculer vers l'onglet Documents
  const handleDocumentGenerated = () => {
    // Basculer automatiquement vers l'onglet Documents
    setActiveTab('documents');
    
    // Déclencher un refresh des données
    if (onRefreshCadastralData) {
      setTimeout(() => {
        onRefreshCadastralData();
      }, 1000);
    }
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
        <TabsTrigger value="client-info" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>Fiche Client</span>
        </TabsTrigger>
        <TabsTrigger value="projects" className="flex items-center gap-1">
          <Home className="h-4 w-4" />
          <span>Projets</span>
        </TabsTrigger>
        <TabsTrigger value="calculations" className="flex items-center gap-1">
          <Calculator className="h-4 w-4" />
          <span>Calculs</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>Documents</span>
        </TabsTrigger>
        <TabsTrigger value="photos-chantier" className="flex items-center gap-1">
          <ImageIcon className="h-4 w-4" />
          <span>Photos Chantier</span>
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center gap-1">
          <Receipt className="h-4 w-4" />
          <span>Facturation</span>
        </TabsTrigger>
        <TabsTrigger value="statistics" className="flex items-center gap-1">
          <BarChart className="h-4 w-4" />
          <span>Statistiques</span>
        </TabsTrigger>
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

      <TabsContent value="projects">
        <ProjectsTab clientId={clientId} />
      </TabsContent>

      <TabsContent value="calculations">
        <CalculationsTab 
          clientId={clientId}
          clientName={client?.name} 
          clientAddress={clientAddress}
          savedCalculations={savedCalculations} 
          onOpenCalculation={onShowCalculation} 
          onCreateNewCalculation={() => onShowCalculation()} 
        />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab clientId={clientId} />
      </TabsContent>

      <TabsContent value="photos-chantier">
        <PhotosChantierTab 
          clientId={clientId} 
          clientName={client?.name}
          onDocumentGenerated={handleDocumentGenerated}
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
