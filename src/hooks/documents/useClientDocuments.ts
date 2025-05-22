import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdministrativeDocument, DocumentStatus } from "@/types/documents";
import { determineDocumentCategory, generateDemoDocuments } from "./useDemoDocuments";
import { useDocumentSearch } from "./useDocumentSearch";
import { useDocumentActions } from "./useDocumentActions";

// Mock function to replace the Supabase call
const getDocumentsForClient = async (clientId: string) => {
  console.log("Mock getDocumentsForClient called", clientId);
  return [];
};

export const useClientDocuments = (clientId?: string, clientName?: string) => {
  const [adminDocuments, setAdminDocuments] = useState<AdministrativeDocument[]>([]);
  const [projectType, setProjectType] = useState("RES010");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load client documents
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      
      try {
        if (clientId) {
          const documents = await getDocumentsForClient(clientId);
          
          // Transform documents into AdminDocument format
          const formattedDocs = documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type || "pdf",
            category: determineDocumentCategory(doc.name),
            // Convert string status to DocumentStatus type
            status: (doc.status || "available") as DocumentStatus,
            created_at: doc.created_at,
            content: doc.content,
            file_path: doc.file_path,
            description: "",  // Default empty description
            order: 0,         // Default order
            // Add status label based on document type and status
            statusLabel: getStatusLabelForDocument(doc.type || "pdf", doc.status || "available")
          }));
          
          setAdminDocuments(formattedDocs);
        } else {
          // If no clientId, load demo documents
          const demoDocuments = generateDemoDocuments(clientName, projectType);
          setAdminDocuments(demoDocuments);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents. Veuillez réessayer.",
          variant: "destructive",
        });
        
        // Load demo documents in case of error
        const demoDocuments = generateDemoDocuments(clientName, projectType);
        setAdminDocuments(demoDocuments);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [clientId, clientName, projectType, toast]);
  
  // Document search functionality
  const { searchQuery, setSearchQuery, filteredDocuments } = useDocumentSearch(adminDocuments);
  
  // Document actions
  const { handleDocumentAction, handleExportAll } = useDocumentActions();
  
  // Function to update project type
  const updateProjectType = useCallback((type: string) => {
    setProjectType(type);
  }, []);
  
  // Function to handle document actions with ID lookup
  const handleDocumentActionById = useCallback((documentId: string, action: string) => {
    const document = adminDocuments.find(doc => doc.id === documentId);
    return handleDocumentAction(document, action);
  }, [adminDocuments, handleDocumentAction]);
  
  // Function to handle export all for filtered documents
  const handleExportAllFiltered = useCallback(() => {
    handleExportAll(filteredDocuments);
  }, [filteredDocuments, handleExportAll]);
  
  return {
    adminDocuments,
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    projectType,
    updateProjectType,
    handleDocumentAction: handleDocumentActionById,
    handleExportAll: handleExportAllFiltered,
    isLoading
  };
};

// Helper function to determine status label based on document type and status
function getStatusLabelForDocument(type: string, status: string): string {
  if (status === "pending") {
    switch (type.toLowerCase()) {
      case "ficha":
        return "En attente CEE PREVIO";
      case "certificado":
        return "En attente CEE POSTERIOR";
      case "anexo":
        return "En attente signatures";
      case "factura":
        return "En attente de validation";
      default:
        return "En attente de données";
    }
  }
  
  if (status === "action-required") {
    switch (type.toLowerCase()) {
      case "fotos":
        return "Photos requises";
      case "certificado":
        return "Signature E. Chiche requise";
      default:
        return "Action requise";
    }
  }
  
  return "";
}
