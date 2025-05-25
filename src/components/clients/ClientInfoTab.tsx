
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"; 
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { ClientTabsContainer } from "./ClientTabsContainer";
import ClientInfoCard from "./ClientInfoCard";
import CadastralInfo from "./CadastralInfo";

interface ClientInfoTabProps {
  client: any;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  loadingCadastral: boolean;
  coordinates?: GeoCoordinates;
  onShowCalculation?: (projectId?: string) => void;
  onAddressChange?: (newAddress: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
  onRefreshCadastralData?: () => Promise<void>;
}

const ClientInfoTab = ({ 
  client, 
  utmCoordinates, 
  cadastralReference, 
  climateZone,
  apiSource,
  loadingCadastral,
  coordinates,
  onShowCalculation,
  onAddressChange,
  onCoordinatesChange,
  onRefreshCadastralData
}: ClientInfoTabProps) => {
  const { toast } = useToast();
  // Adresse par défaut du client
  const [address, setAddress] = useState(client.address || "Rue Serrano 120, 28006 Madrid");
  const [surfaceArea, setSurfaceArea] = useState("56");
  const [roofArea, setRoofArea] = useState("89");
  const [floorType, setFloorType] = useState("Bois");
  
  // Gestionnaire de changement d'adresse
  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    // Propager le changement d'adresse au composant parent
    if (onAddressChange) {
      onAddressChange(newAddress);
    }
    
    // Notification de modification d'adresse
    toast({
      title: "Adresse mise à jour",
      description: "Géolocalisation en cours...",
      duration: 3000,
    });
  };
  
  // Gestionnaire de changement de coordonnées
  const handleCoordinatesChange = (coordinates: GeoCoordinates) => {
    if (onCoordinatesChange) {
      onCoordinatesChange(coordinates);
      console.log("Nouvelles coordonnées reçues:", coordinates);
      
      // Notification de récupération des données cadastrales
      toast({
        title: "Coordonnées obtenues",
        description: "Récupération des données cadastrales en cours...",
        duration: 3000,
      });
    }
  };

  // Gestionnaire de rafraîchissement des données cadastrales
  const handleRefreshCadastralData = async () => {
    if (onRefreshCadastralData) {
      toast({
        title: "Actualisation des données",
        description: "Nouvelle requête aux services cadastraux en cours...",
        duration: 3000,
      });
      
      await onRefreshCadastralData();
    }
  };

  // Mock data for ClientTabsContainer
  const mockSavedCalculations: any[] = [];
  
  const handleNewCalculation = () => {
    if (onShowCalculation) {
      onShowCalculation();
    }
  };

  const handleEditCalculation = (projectId: string) => {
    if (onShowCalculation) {
      onShowCalculation(projectId);
    }
  };

  const handleDeleteCalculation = (projectId: string) => {
    console.log("Deleting calculation:", projectId);
  };

  const handleBack = () => {
    // Handle back navigation if needed
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ClientInfoCard 
          client={client}
          address={address}
          onAddressChange={handleAddressChange}
          onCoordinatesChange={handleCoordinatesChange}
          utmCoordinates={utmCoordinates}
          cadastralReference={cadastralReference}
          climateZone={climateZone}
          apiSource={apiSource}
          loadingCadastral={loadingCadastral}
          onRefreshCadastralData={handleRefreshCadastralData}
          gpsCoordinates={coordinates}
        />
      </div>

      <div className="lg:col-span-2">
        <ClientTabsContainer 
          client={client}
          clientId={client?.id || ""}
          savedCalculations={mockSavedCalculations}
          onNewCalculation={handleNewCalculation}
          onEditCalculation={handleEditCalculation}
          onDeleteCalculation={handleDeleteCalculation}
          onBack={handleBack}
          surfaceArea={surfaceArea}
          roofArea={roofArea}
          floorType={floorType}
        />
      </div>
    </div>
  );
};

export default ClientInfoTab;
