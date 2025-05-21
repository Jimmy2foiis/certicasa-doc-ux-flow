
import { DocumentsTabContent } from "./DocumentsTabContent"; // Changed to named import
import { useClientData } from "@/hooks/useClientData";

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const { client } = useClientData(clientId);
  
  return (
    <DocumentsTabContent 
      clientId={clientId} 
      clientName={client?.name} 
      projectType={client?.type || "RES010"}
    />
  );
};

export default DocumentsTab;
