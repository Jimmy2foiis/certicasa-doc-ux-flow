
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useClientData } from "@/hooks/useClientData";
import ClientDetailsHeader from "./ClientDetailsHeader";
import ClientDetailsTabs from "./ClientDetailsTabs";
import CalculationHandler from "./CalculationHandler";

interface ClientDetailsViewProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetailsView = ({ clientId, onBack }: ClientDetailsViewProps) => {
  const { 
    client, 
    clientAddress, 
    setClientAddress, 
    coordinates,
    setClientCoordinates,
    savedCalculations, 
    loadingCadastral, 
    utmCoordinates, 
    cadastralReference, 
    climateZone,
    apiSource,
    refreshCadastralData 
  } = useClientData(clientId);
  const [showCalculations, setShowCalculations] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("client-info");
  const { toast } = useToast();

  // Fonction pour mettre à jour l'adresse et rafraîchir les données cadastrales
  const handleAddressChange = (newAddress: string) => {
    setClientAddress(newAddress);
    
    // Afficher une notification
    toast({
      title: "Adresse mise à jour",
      description: "Les données cadastrales sont en cours de mise à jour...",
      duration: 3000
    });
  };

  // Fonction pour mettre à jour les coordonnées
  const handleCoordinatesChange = (coordinates: any) => {
    setClientCoordinates(coordinates);
    
    // Afficher une notification
    toast({
      title: "Coordonnées mises à jour",
      description: "Récupération des données cadastrales avec précision GPS...",
      duration: 3000
    });
  };

  // Ouvrir un calcul existant ou en créer un nouveau
  const handleShowCalculation = (projectId?: string) => {
    setCurrentProjectId(projectId || null);
    setShowCalculations(true);
  };
  
  // Fonction pour gérer la génération d'un document
  const handleDocumentGenerated = (documentId: string) => {
    toast({
      title: "Document généré",
      description: `Document ajouté au dossier client de ${client?.name}`,
      duration: 3000
    });
    
    // Si on n'est pas déjà sur l'onglet documents, y naviguer
    if (activeTab !== "documents") {
      setActiveTab("documents");
    }
  };
  
  if (!client) return null;

  if (showCalculations) {
    return (
      <CalculationHandler 
        client={{...client, climateZone}} 
        clientId={clientId}
        currentProjectId={currentProjectId}
        savedCalculations={savedCalculations}
        onBack={() => setShowCalculations(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ClientDetailsHeader 
        onBack={onBack} 
        clientId={clientId} 
        clientName={client.name}
        onDocumentGenerated={handleDocumentGenerated}
      />

      <ClientDetailsTabs 
        clientId={clientId}
        clientAddress={clientAddress}
        client={client}
        utmCoordinates={utmCoordinates}
        cadastralReference={cadastralReference}
        climateZone={climateZone}
        apiSource={apiSource}
        loadingCadastral={loadingCadastral}
        coordinates={coordinates}
        savedCalculations={savedCalculations}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onShowCalculation={handleShowCalculation}
        onAddressChange={handleAddressChange}
        onCoordinatesChange={handleCoordinatesChange}
        onRefreshCadastralData={refreshCadastralData}
      />
    </div>
  );
};

export default ClientDetailsView;
