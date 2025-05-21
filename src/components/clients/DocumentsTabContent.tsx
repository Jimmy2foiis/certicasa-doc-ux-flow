
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DocumentsCardHeader from "@/components/documents/DocumentsCardHeader";
import DocumentsExportFooter from "@/components/documents/DocumentsExportFooter";
import DocumentsAccordion from "@/components/documents/DocumentsAccordion";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AdministrativeDocument } from "@/types/documents";

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
    setSearchQuery,
    isLoading
  } = useAdministrativeDocuments(clientId, clientName);
  
  const { toast } = useToast();
  
  // Correction du hook useEffect pour éviter les mises à jour infinies
  useEffect(() => {
    if (projectType) {
      // Simplement appeler updateProjectType sans logique conditionnelle additionnelle
      updateProjectType(projectType);
    }
  }, [projectType, updateProjectType]); // On garde updateProjectType dans les dépendances car c'est une fonction memoized

  // Notification une fois les documents chargés
  useEffect(() => {
    if (adminDocuments.length > 0 && !isLoading) {
      toast({
        title: "Documents chargés",
        description: `${adminDocuments.length} documents disponibles pour ${clientName}`,
        duration: 3000
      });
    }
  }, [adminDocuments, isLoading, clientName, toast]);

  // Conversion sécurisée du type pour éviter les erreurs TypeScript
  const typedAdminDocuments: AdministrativeDocument[] = adminDocuments.map(doc => ({
    ...doc,
    description: doc.description || doc.name || "", // Ajouter description par défaut si non définie
    order: doc.order || 0 // Ajouter order par défaut si non défini
  }));

  // Conversion des filteredDocuments aussi
  const typedFilteredDocuments: AdministrativeDocument[] = filteredDocuments.map(doc => ({
    ...doc,
    description: doc.description || doc.name || "",
    order: doc.order || 0
  }));

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
        
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
            <p>Chargement des documents...</p>
          </div>
        ) : (
          <DocumentsAccordion 
            documents={typedFilteredDocuments} 
            onDocumentAction={handleDocumentAction}
          />
        )}
      </CardContent>
      <DocumentsExportFooter onExportAll={handleExportAll} />
    </Card>
  );
};

export default DocumentsTabContent;
