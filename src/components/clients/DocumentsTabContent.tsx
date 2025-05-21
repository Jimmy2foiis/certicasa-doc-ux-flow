
import { useState, useEffect } from "react";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";
import { AdministrativeDocument, DocumentStatus } from "@/types/documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileUp, FileDown, RefreshCcw, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge";
import { DocumentActionButtons } from "@/components/documents/DocumentActionButtons";

interface DocumentsTabContentProps {
  clientId?: string;
  clientName?: string;
  projectType?: string;
}

export const DocumentsTabContent = ({ clientId, clientName, projectType = "RES010" }: DocumentsTabContentProps) => {
  const {
    adminDocuments,
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    handleDocumentAction,
    handleExportAll,
    isLoading,
    updateProjectType
  } = useAdministrativeDocuments(clientId, clientName);

  const [allDocuments, setAllDocuments] = useState<AdministrativeDocument[]>([]);
  const [clientDocuments, setClientDocuments] = useState<AdministrativeDocument[]>([]);

  // When the administrative documents are loaded
  useEffect(() => {
    if (clientId && adminDocuments) {
      // Transform AdminDocuments to ensure they have all required properties for AdministrativeDocument
      const transformedDocs = adminDocuments.map(doc => ({
        ...doc,
        // Add required properties that may be missing
        description: (doc as any).description || "",
        order: (doc as any).order || 0,
        // Make sure other required properties are present
        id: doc.id,
        name: doc.name,
        type: doc.type,
        status: doc.status as DocumentStatus, // Cast string to DocumentStatus type
      }));
      
      // Create a combined list
      const combinedDocs: AdministrativeDocument[] = [
        ...transformedDocs,
        ...clientDocuments.map(doc => ({
          ...doc,
          description: (doc as any).description || "",
          order: (doc as any).order || 0,
        }))
      ];
      
      setAllDocuments(combinedDocs);
    }
  }, [clientId, adminDocuments, clientDocuments]);

  // Update project type when it changes from prop
  useEffect(() => {
    if (projectType) {
      updateProjectType(projectType);
    }
  }, [projectType, updateProjectType]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Documents du client</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportAll()}
              disabled={isLoading || filteredDocuments.length === 0}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Exporter tout
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <FileUp className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 my-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un document..."
            className="h-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9" 
            onClick={() => setSearchQuery("")}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-20 mt-2" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun document trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-muted p-2 rounded-md">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.category} • {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DocumentStatusBadge status={doc.status as DocumentStatus} />
                  <DocumentActionButtons 
                    documentType={doc.type} 
                    status={doc.status as DocumentStatus}
                    onAction={(action) => handleDocumentAction(doc.id, action)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
