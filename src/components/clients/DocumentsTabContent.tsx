import { useState, useEffect } from "react";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";
import { AdministrativeDocument, DocumentStatus } from "@/types/documents";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { documentService } from "@/services/documentService";
import { DocumentsHeader } from "./documents/DocumentsHeader";
import DocumentsAccordion from "@/components/documents/DocumentsAccordion";
import { DocumentsFooter } from "./documents/DocumentsFooter";

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
    handleDocumentAction: baseHandleDocumentAction,
    handleExportAll: baseHandleExportAll,
    isLoading,
    updateProjectType
  } = useAdministrativeDocuments(clientId, clientName);

  const [allDocuments, setAllDocuments] = useState<AdministrativeDocument[]>([]);
  const [clientDocuments, setClientDocuments] = useState<AdministrativeDocument[]>([]);
  const [previewDocument, setPreviewDocument] = useState<AdministrativeDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  // When administrative documents are loaded
  useEffect(() => {
    if (clientId && adminDocuments) {
      // Transform AdminDocuments to ensure they have all required properties
      const transformedDocs = adminDocuments.map(doc => ({
        ...doc,
        description: (doc as any).description || "",
        order: (doc as any).order || 0,
        id: doc.id,
        name: doc.name,
        type: doc.type,
        status: doc.status as DocumentStatus,
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

  // Update project type when it changes
  useEffect(() => {
    if (projectType) {
      updateProjectType(projectType);
    }
  }, [projectType, updateProjectType]);

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle document actions with preview
  const handleDocumentAction = async (documentId: string, action: string) => {
    try {
      switch (action) {
        case "view":
          // Find document to preview
          const docToPreview = filteredDocuments.find(doc => doc.id === documentId);
          if (docToPreview) {
            // Convert to AdministrativeDocument type with required properties
            setPreviewDocument({
              ...docToPreview,
              description: (docToPreview as any).description || "",
              order: (docToPreview as any).order || 0,
              status: docToPreview.status as DocumentStatus
            });
            setIsPreviewOpen(true);
          } else {
            toast({
              title: "Erreur",
              description: "Document introuvable",
              variant: "destructive",
            });
          }
          break;
          
        case "download":
          const docToDownload = filteredDocuments.find(doc => doc.id === documentId);
          if (!docToDownload) {
            toast({
              title: "Erreur",
              description: "Document introuvable",
              variant: "destructive",
            });
            return;
          }
          
          // If we have the content directly, use it
          if (docToDownload.content) {
            const success = await documentService.downloadDocument(
              docToDownload.content, 
              docToDownload.name, 
              docToDownload.type
            );
            
            if (success) {
              toast({
                title: "Téléchargement réussi",
                description: `Le document ${docToDownload.name} a été téléchargé avec succès`,
              });
            } else {
              toast({
                title: "Erreur de téléchargement",
                description: "Impossible de télécharger le document",
                variant: "destructive",
              });
            }
          } else {
            // Otherwise, fetch document content
            toast({
              title: "Téléchargement en cours",
              description: "Récupération du document...",
            });
            
            const documentData = await documentService.getDocumentContent(documentId);
            
            if (documentData && documentData.content) {
              const success = await documentService.downloadDocument(
                documentData.content,
                documentData.name,
                documentData.type
              );
              
              if (success) {
                toast({
                  title: "Téléchargement réussi",
                  description: `Le document ${documentData.name} a été téléchargé avec succès`,
                });
              } else {
                toast({
                  title: "Erreur de téléchargement",
                  description: "Impossible de télécharger le document",
                  variant: "destructive",
                });
              }
            } else {
              toast({
                title: "Erreur",
                description: "Contenu du document non disponible",
                variant: "destructive",
              });
            }
          }
          break;
          
        default:
          // For all other actions, use the existing handler
          baseHandleDocumentAction(documentId, action);
      }
    } catch (error) {
      console.error("Erreur lors de l'action sur le document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre demande",
        variant: "destructive",
      });
    }
  };

  // Handle exporting all documents
  const handleExportAll = async () => {
    try {
      toast({
        title: "Export groupé",
        description: "Préparation de l'export des documents...",
      });
      
      const success = await documentService.exportAllDocuments(filteredDocuments);
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Tous les documents ont été exportés avec succès",
        });
      } else {
        toast({
          title: "Erreur d'exportation",
          description: "Impossible d'exporter tous les documents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation des documents:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exportation",
        variant: "destructive",
      });
    }
  };

  // Close preview
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <DocumentsHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={() => setSearchQuery("")}
          onExportAll={handleExportAll}
          isLoading={isLoading}
          documentCount={filteredDocuments.length}
        />
      </CardHeader>
      
      <CardContent>
        <DocumentsList 
          documents={filteredDocuments}
          isLoading={isLoading}
          onAction={handleDocumentAction}
        />
      </CardContent>
      
      <CardFooter className="pt-2">
        <DocumentsFooter 
          onExportAll={handleExportAll}
          documentCount={filteredDocuments.length}
          isLoading={isLoading}
        />
      </CardFooter>

      {/* Document preview component */}
      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        document={previewDocument}
        onDownload={(documentId) => handleDocumentAction(documentId, "download")}
      />
    </Card>
  );
};

// Loading state component
const DocumentsLoadingState = () => (
  <div className="space-y-3">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
          <div>
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 mt-2 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
      </div>
    ))}
  </div>
);

// Component to display the list of documents
const DocumentsList = ({ documents, isLoading, onAction }: { 
  documents: AdministrativeDocument[], 
  isLoading: boolean,
  onAction: (documentId: string, action: string) => void
}) => {
  if (isLoading) {
    return <DocumentsLoadingState />;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun document trouvé</p>
      </div>
    );
  }

  return (
    <DocumentsAccordion 
      documents={documents}
      onDocumentAction={onAction}
    />
  );
};
