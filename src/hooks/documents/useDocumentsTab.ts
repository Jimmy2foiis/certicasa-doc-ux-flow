import { useState, useEffect } from "react";
import { useAdministrativeDocuments } from "@/hooks/useAdministrativeDocuments";
import { AdministrativeDocument } from "@/types/documents";
import { useToast } from "@/hooks/use-toast";
import { documentService, getDocumentContent, exportAllDocuments } from "@/services/documentService";
import useDocumentSearch from "./useDocumentSearch";

export const useDocumentsTab = (clientId?: string, clientName?: string) => {
  const { loading, documents, addDocument, updateDocument, deleteDocument, determineDocumentCategory } = useAdministrativeDocuments(clientId);
  const { filteredDocuments, searchQuery, setSearchQuery } = useDocumentSearch(documents);
  const [allDocuments, setAllDocuments] = useState<AdministrativeDocument[]>([]);
  const [clientDocuments, setClientDocuments] = useState<AdministrativeDocument[]>([]);
  const [previewDocument, setPreviewDocument] = useState<AdministrativeDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isLoading = loading;

  // When administrative documents are loaded
  useEffect(() => {
    if (clientId && documents) {
      // Transform AdminDocuments to ensure they have all required properties
      const transformedDocs = documents.map(doc => ({
        ...doc,
        description: (doc as any).description || "",
        order: (doc as any).order || 0,
        id: doc.id,
        name: doc.name,
        type: doc.type,
        status: doc.status,
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
  }, [clientId, documents, clientDocuments]);

  const updateProjectType = (projectType: string) => {
    // This function would update the project type in a real implementation
    console.log("Update project type to:", projectType);
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle document actions with preview
  const handleDocumentAction = async (documentId: string, action: string) => {
    try {
      setError(null);
      
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
              status: docToPreview.status
            });
            setIsPreviewOpen(true);
          } else {
            setError("Document introuvable");
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
            setError("Document introuvable");
            toast({
              title: "Erreur",
              description: "Document introuvable",
              variant: "destructive",
            });
            return;
          }
          
          // If we have the content directly, use it
          if (docToDownload.content) {
            // Valider le contenu avant téléchargement
            const validationResult = documentService.validateDocumentContent(
              docToDownload.content, 
              docToDownload.type
            );
            
            if (!validationResult.success) {
              setError(`Contenu de document invalide: ${validationResult.error}`);
              toast({
                title: "Erreur",
                description: validationResult.error,
                variant: "destructive",
              });
              return;
            }
            
            const downloadResult = await documentService.downloadDocument(
              docToDownload.content, 
              docToDownload.name, 
              docToDownload.type
            );
            
            if (downloadResult.success) {
              toast({
                title: "Téléchargement réussi",
                description: `Le document ${docToDownload.name} a été téléchargé avec succès`,
              });
            } else {
              setError(`Erreur de téléchargement: ${downloadResult.error}`);
              toast({
                title: "Erreur de téléchargement",
                description: downloadResult.error || "Impossible de télécharger le document",
                variant: "destructive",
              });
            }
          } else {
            // Otherwise, fetch document content
            toast({
              title: "Téléchargement en cours",
              description: "Récupération du document...",
            });
            
            const documentData = await getDocumentContent(documentId);
            
            if (documentData && documentData.success && documentData.data?.content) {
              // Valider le contenu avant téléchargement
              const validationResult = documentService.validateDocumentContent(
                documentData.data.content, 
                documentData.data.type
              );
              
              if (!validationResult.success) {
                setError(`Contenu de document invalide: ${validationResult.error}`);
                toast({
                  title: "Erreur",
                  description: validationResult.error,
                  variant: "destructive",
                });
                return;
              }
              
              const downloadResult = await documentService.downloadDocument(
                documentData.data.content,
                documentData.data.name,
                documentData.data.type
              );
              
              if (downloadResult.success) {
                toast({
                  title: "Téléchargement réussi",
                  description: `Le document ${documentData.data.name} a été téléchargé avec succès`,
                });
              } else {
                setError(`Erreur de téléchargement: ${downloadResult.error}`);
                toast({
                  title: "Erreur de téléchargement",
                  description: downloadResult.error || "Impossible de télécharger le document",
                  variant: "destructive",
                });
              }
            } else {
              setError("Contenu du document non disponible ou invalide");
              toast({
                title: "Erreur",
                description: documentData.error || "Contenu du document non disponible",
                variant: "destructive",
              });
            }
          }
          break;
          
        default:
          // For other actions
          console.log("Action:", action, "for document:", documentId);
          // You could implement other actions here
          break;
      }
    } catch (error) {
      console.error("Erreur lors de l'action sur le document:", error);
      setError(error instanceof Error ? error.message : "Erreur inattendue");
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
      setError(null);
      
      if (!filteredDocuments || filteredDocuments.length === 0) {
        setError("Aucun document à exporter");
        toast({
          title: "Information",
          description: "Aucun document à exporter.",
          variant: "default",
        });
        return;
      }
      
      toast({
        title: "Export groupé",
        description: "Préparation de l'export des documents...",
      });
      
      const exportResult = await exportAllDocuments(filteredDocuments);
      
      if (exportResult.success) {
        toast({
          title: "Export réussi",
          description: "Tous les documents ont été exportés avec succès",
        });
      } else {
        setError(`Erreur d'exportation: ${exportResult.error}`);
        toast({
          title: "Erreur d'exportation",
          description: exportResult.error || "Impossible d'exporter tous les documents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation des documents:", error);
      setError(error instanceof Error ? error.message : "Erreur inattendue");
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

  return {
    filteredDocuments,
    searchQuery,
    handleSearchChange,
    handleDocumentAction,
    handleExportAll,
    isLoading,
    updateProjectType,
    isPreviewOpen,
    previewDocument,
    handleClosePreview,
    error
  };
};
