
import DocumentsTabContent from "./DocumentsTabContent";

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  return <DocumentsTabContent clientId={clientId} />;
};

export default DocumentsTab;
