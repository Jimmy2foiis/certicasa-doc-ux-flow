
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DocumentsCardHeader from "@/components/documents/DocumentsCardHeader";
import DocumentsExportFooter from "@/components/documents/DocumentsExportFooter";
import DocumentsAccordion from "@/components/documents/DocumentsAccordion";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    updateProjectType,
    filteredDocuments,
    filterDocuments,
    searchQuery,
    setSearchQuery
  } = useAdministrativeDocuments(clientId, clientName);
  
  // Correction du hook useEffect pour éviter les mises à jour infinies
  useEffect(() => {
    if (projectType) {
      // Simplement appeler updateProjectType sans logique conditionnelle additionnelle
      updateProjectType(projectType);
    }
  }, [projectType]); // Supprimer updateProjectType des dépendances pour éviter les boucles

  return (
    <Card className="shadow-sm">
      <DocumentsCardHeader clientName={clientName} projectType={projectType} />
      <CardContent className="pt-4">
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un document..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <DocumentsAccordion 
          documents={filteredDocuments} 
          onDocumentAction={handleDocumentAction}
        />
      </CardContent>
      <DocumentsExportFooter onExportAll={handleExportAll} />
    </Card>
  );
};

export default DocumentsTabContent;
