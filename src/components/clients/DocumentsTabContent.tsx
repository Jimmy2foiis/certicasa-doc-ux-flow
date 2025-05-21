
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DocumentsCardHeader from "@/components/documents/DocumentsCardHeader";
import DocumentsExportFooter from "@/components/documents/DocumentsExportFooter";
import DocumentsAccordion from "@/components/documents/DocumentsAccordion";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText } from "lucide-react";
import ClientDocumentGenerator from "@/components/clients/ClientDocumentGenerator";

interface DocumentsTabContentProps {
  clientId?: string;
  clientName?: string;
  projectType?: string;
}

const DocumentsTabContent = ({ clientId = "", clientName = "Client", projectType = "RES010" }: DocumentsTabContentProps) => {
  const { 
    adminDocuments,
    handleDocumentAction,
    handleExportAll,
    updateProjectType,
    filteredDocuments,
    filterDocuments,
    searchQuery,
    setSearchQuery,
    refreshDocuments
  } = useAdministrativeDocuments(clientId, clientName);
  
  // Correction du hook useEffect pour éviter les mises à jour infinies
  useEffect(() => {
    if (projectType) {
      // Simplement appeler updateProjectType sans logique conditionnelle additionnelle
      updateProjectType(projectType);
    }
  }, [projectType]); // Supprimer updateProjectType des dépendances pour éviter les boucles

  const handleDocumentGenerated = (documentId: string) => {
    // Refresh documents list when a new document is generated
    refreshDocuments();
  };

  return (
    <Card className="shadow-sm">
      <DocumentsCardHeader clientName={clientName} projectType={projectType} />
      <CardContent className="pt-4">
        <div className="mb-4 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un document..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {clientId && (
            <ClientDocumentGenerator 
              clientId={clientId} 
              clientName={clientName} 
              onDocumentGenerated={handleDocumentGenerated}
            />
          )}
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
