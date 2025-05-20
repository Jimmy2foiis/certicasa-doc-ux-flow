
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

interface ClientInfoTabProps {
  client: any;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  loadingCadastral: boolean;
  onShowCalculation?: (projectId?: string) => void;
  onAddressChange?: (newAddress: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void; // Nouvelle prop pour les coordonnées
}

const ClientInfoTab = ({ 
  client, 
  utmCoordinates, 
  cadastralReference, 
  climateZone,
  loadingCadastral,
  onShowCalculation,
  onAddressChange,
  onCoordinatesChange
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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientPersonalInfo 
            client={client} 
            address={address}
            onAddressChange={handleAddressChange}
            onCoordinatesChange={handleCoordinatesChange}
            utmCoordinates={utmCoordinates}
            cadastralReference={cadastralReference}
            climateZone={climateZone}
            loadingCadastral={loadingCadastral}
          />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Tabs defaultValue="projects">
          <TabsList className="w-full">
            <TabsTrigger value="projects" className="flex-1">Projets</TabsTrigger>
            <TabsTrigger value="calculations" className="flex-1">Calculs</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="signatures" className="flex-1">Signatures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-4">
            <ProjectsTabContent onShowCalculation={onShowCalculation} />
          </TabsContent>
          
          <TabsContent value="calculations" className="mt-4">
            <CalculationsTabContent onShowCalculation={onShowCalculation} />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <DocumentsTabContent />
          </TabsContent>
          
          <TabsContent value="signatures" className="mt-4">
            <SignaturesTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientInfoTab;
