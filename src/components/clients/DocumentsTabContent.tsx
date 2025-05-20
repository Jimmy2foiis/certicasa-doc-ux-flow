
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
  
  // Correction du hook useEffect pour éviter les mises à jour infinies
  useEffect(() => {
    if (projectType) {
      // Simplement appeler updateProjectType sans logique conditionnelle additionnelle
      // Laissez la gestion interne du hook s'occuper de vérifier si une mise à jour est nécessaire
      updateProjectType(projectType);
    }
  }, [projectType]); // Supprimer updateProjectType des dépendances pour éviter les boucles

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
