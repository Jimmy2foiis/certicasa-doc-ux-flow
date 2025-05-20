
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientPersonalInfo from "./ClientPersonalInfo";
import ProjectsTabContent from "./ProjectsTabContent";
import CalculationsTabContent from "./CalculationsTabContent";
import DocumentsTabContent from "./DocumentsTabContent";
import SignaturesTabContent from "./SignaturesTabContent";
import { useToast } from "@/components/ui/use-toast"; 
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { ClientTabsContainer } from "./ClientTabsContainer";

interface ClientInfoTabProps {
  client: any;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  loadingCadastral: boolean;
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
  onShowCalculation,
  onAddressChange,
  onCoordinatesChange,
  onRefreshCadastralData
}: ClientInfoTabProps) => {
  const { toast } = useToast();
  // Adresse par défaut du client
  const [address, setAddress] = useState(client.address || "Rue Serrano 120, 28006 Madrid");
  
  // Gestionnaire de changement d'adresse
  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    // Propager le changement d'adresse au composant parent pour mettre à jour les données cadastrales
    if (onAddressChange) {
      onAddressChange(newAddress);
    }
    
    // Notification de modification d'adresse
    toast({
      title: "Adresse mise à jour",
      description: "Données cadastrales en cours de récupération...",
      duration: 3000,
    });
  };
  
  // Gestionnaire de changement de coordonnées
  const handleCoordinatesChange = (coordinates: GeoCoordinates) => {
    if (onCoordinatesChange) {
      onCoordinatesChange(coordinates);
      console.log("Nouvelles coordonnées reçues:", coordinates);
    }
  };

  // Gestionnaire de rafraîchissement des données cadastrales
  const handleRefreshCadastralData = async () => {
    if (onRefreshCadastralData) {
      toast({
        title: "Rafraîchissement des données",
        description: "Nouvelle requête aux services cadastraux en cours...",
        duration: 3000,
      });
      
      await onRefreshCadastralData();
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      />

      <ClientTabsContainer onShowCalculation={onShowCalculation} />
    </div>
  );
};

export default ClientInfoTab;
