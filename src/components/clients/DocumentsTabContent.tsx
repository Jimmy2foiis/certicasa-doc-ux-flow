
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DocumentsCardHeader from "@/components/documents/DocumentsCardHeader";
import DocumentsTable from "@/components/documents/DocumentsTable";
import DocumentsExportFooter from "@/components/documents/DocumentsExportFooter";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";

interface DocumentsTabContentProps {
  clientId?: string;
  clientName?: string;
  projectType?: string;
}

const DocumentsTabContent = ({ clientId, clientName = "Client", projectType = "RES010" }: DocumentsTabContentProps) => {
  const { 
    adminDocuments,
    handleDocumentAction,
    handleExportAll,
    updateProjectType
  } = useAdministrativeDocuments(clientId, clientName);
  
  // Update document type when projectType changes
  useEffect(() => {
    if (projectType) {
      updateProjectType(projectType);
    }
  }, [projectType, updateProjectType]);

  return (
    <Card className="shadow-sm">
      <DocumentsCardHeader clientName={clientName} projectType={projectType} />
      <CardContent className="pt-6">
        <DocumentsTable 
          documents={adminDocuments} 
          onDocumentAction={handleDocumentAction} 
        />
      </CardContent>
      <DocumentsExportFooter onExportAll={handleExportAll} />
    </Card>
  );
};

export default DocumentsTabContent;
