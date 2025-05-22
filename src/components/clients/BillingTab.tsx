
import EnhancedBillingTab from "./EnhancedBillingTab";
import { useClientData } from "@/hooks/useClientData";

interface BillingTabProps {
  clientId: string;
}

const BillingTab = ({ clientId }: BillingTabProps) => {
  const { client } = useClientData(clientId);
  
  if (!client) return null;
  
  return (
    <EnhancedBillingTab 
      clientId={clientId} 
      clientName={client.name} 
    />
  );
};

export default BillingTab;
