
import { useState } from "react";
import ClientDetailsView from "./ClientDetailsView";

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetails = ({ clientId, onBack }: ClientDetailsProps) => {
  const [refreshData, setRefreshData] = useState(0);
  
  // Fonction pour déclencher un rafraîchissement des données
  const handleClientUpdated = () => {
    setRefreshData(prev => prev + 1);
  };
  
  return (
    <ClientDetailsView 
      clientId={clientId} 
      onBack={onBack} 
      key={`client-view-${refreshData}`} 
      onClientUpdated={handleClientUpdated}
    />
  );
};

export default ClientDetails;
