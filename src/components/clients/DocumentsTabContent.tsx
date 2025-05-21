
import { useState, useEffect } from "react";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";
import { AdministrativeDocument, DocumentStatus } from "@/types/documents";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileUp, FileDown, RefreshCcw, FileText, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge";
import DocumentActionButtons from "@/components/documents/DocumentActionButtons";
import { useToast } from "@/hooks/use-toast";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { documentService } from "@/services/documentService";

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

  // Quand les documents administratifs sont chargés
  useEffect(() => {
    if (clientId && adminDocuments) {
      // Transformer les AdminDocuments pour s'assurer qu'ils ont toutes les propriétés requises
      const transformedDocs = adminDocuments.map(doc => ({
        ...doc,
        description: (doc as any).description || "",
        order: (doc as any).order || 0,
        id: doc.id,
        name: doc.name,
        type: doc.type,
        status: doc.status as DocumentStatus,
      }));
      
      // Créer une liste combinée
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

  // Mettre à jour le type de projet quand il change
  useEffect(() => {
    if (projectType) {
      updateProjectType(projectType);
    }
  }, [projectType, updateProjectType]);

  // Gérer le changement de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Gérer les actions de document avec prévisualisation
  const handleDocumentAction = async (documentId: string, action: string) => {
    try {
      switch (action) {
        case "view":
          // Trouver le document à prévisualiser
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
          
          // Si nous avons le contenu directement, l'utiliser
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
            // Sinon, récupérer le contenu du document
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
          // Pour toutes les autres actions, utiliser le gestionnaire existant
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

  // Gérer l'exportation de tous les documents
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

  // Fermer la prévisualisation
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
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
              onClick={handleExportAll}
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
                      {doc.category} • {new Date(doc.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DocumentStatusBadge status={doc.status as DocumentStatus} />
                  
                  {/* Boutons d'action principaux (Voir/Télécharger) */}
                  <div className="flex space-x-2">
                    {(doc.status === "generated" || doc.status === "linked") && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDocumentAction(doc.id, "view")}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          <span>Voir</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDocumentAction(doc.id, "download")}
                          className="flex items-center"
                        >
                          <FileDown className="h-4 w-4 mr-1.5" />
                          <span>Télécharger</span>
                        </Button>
                      </>
                    )}
                    
                    {/* Autres boutons d'action spécifiques, sans voir/télécharger (pour éviter les doublons) */}
                    <DocumentActionButtons 
                      documentType={doc.type} 
                      status={doc.status as DocumentStatus}
                      onAction={(action) => handleDocumentAction(doc.id, action)}
                      showViewDownload={false} // Ne pas afficher les boutons Voir et Télécharger pour éviter les doublons
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex justify-end w-full">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExportAll}
            disabled={isLoading || filteredDocuments.length === 0}
            className="flex items-center"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Tout télécharger
          </Button>
        </div>
      </CardFooter>

      {/* Composant de prévisualisation de document */}
      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        document={previewDocument}
        onDownload={(documentId) => handleDocumentAction(documentId, "download")}
      />
    </Card>
  );
};

