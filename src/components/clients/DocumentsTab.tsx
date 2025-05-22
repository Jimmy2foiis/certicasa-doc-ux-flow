
import EnhancedDocumentsTab from "./EnhancedDocumentsTab"; 
import { useClientData } from "@/hooks/useClientData";

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const { client } = useClientData(clientId);
  
  if (!client) return null;
  
  // Convert client.id to beetoolToken if available (for mock data)
  const beetoolToken = (client as any).beetoolToken || client.id;
  
  return (
    <EnhancedDocumentsTab 
      beetoolToken={beetoolToken} 
      clientName={client.name} 
    />
  );
};

export default DocumentsTab;
