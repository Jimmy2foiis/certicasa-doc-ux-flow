import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDocumentsForClient } from "@/services/supabase/documentService";
import type { AdministrativeDocument, DocumentStatus } from "@/types/documents";
import { determineDocumentCategory, generateDemoDocuments } from "./useDemoDocuments";
import { useDocumentSearch } from "./useDocumentSearch";
import { useDocumentActions } from "./useDocumentActions";

export const useClientDocuments = (clientId?: string, clientName?: string) => {
  const [adminDocuments, setAdminDocuments] = useState<AdministrativeDocument[]>([]);
  const [projectType, setProjectType] = useState("RES010");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (clientId) {
        console.log('Loading documents for client:', clientId);
        const documents = await getDocumentsForClient(clientId);
        console.log('Loaded documents from Supabase:', documents);
        
        const formattedDocs: AdministrativeDocument[] = documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type || "pdf",
          category: determineDocumentCategory(doc.name),
          status: (doc.status || "available") as DocumentStatus,
          created_at: doc.created_at,
          content: doc.content,
          file_path: doc.file_path,
          description: "",
          reference: doc.type ? `REF-${doc.type.toUpperCase()}-${doc.id.substring(0, 5)}` : "",
          order: 0,
          statusLabel: getStatusLabelForDocument(doc.type || "pdf", doc.status || "available")
        }));
        
        console.log('Formatted documents:', formattedDocs);
        setAdminDocuments(formattedDocs);
      } else {
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
      
      const demoDocuments = generateDemoDocuments(clientName, projectType);
      setAdminDocuments(demoDocuments);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, clientName, projectType, toast]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    const handleDocumentGenerated = (event: CustomEvent) => {
      console.log('Document généré détecté dans useClientDocuments:', event.detail);
      
      if (event.detail.clientId === clientId) {
        console.log('Refreshing documents for client:', clientId);
        setTimeout(() => {
          loadDocuments();
        }, 1000);
      }
    };

    window.addEventListener('document-generated', handleDocumentGenerated as EventListener);
    
    return () => {
      window.removeEventListener('document-generated', handleDocumentGenerated as EventListener);
    };
  }, [clientId, loadDocuments]);
  
  const { searchQuery, setSearchQuery, filteredDocuments } = useDocumentSearch(adminDocuments);
  const { handleDocumentAction: baseHandleDocumentAction, handleExportAll } = useDocumentActions();
  
  const refreshDocuments = useCallback(() => {
    console.log('Manual refresh triggered...');
    loadDocuments();
  }, [loadDocuments]);
  
  const updateProjectType = useCallback((type: string) => {
    setProjectType(type);
  }, []);
  
  const handleDocumentAction = useCallback((documentId: string, action: string, additionalData?: any) => {
    if (action === 'upload' && additionalData) {
      const { file, name, type } = additionalData;
      
      const newDocument: AdministrativeDocument = {
        id: documentId,
        name: name,
        type: type,
        status: "available" as DocumentStatus,
        description: "",
        reference: `REF-${type.toUpperCase()}-${documentId.substring(0, 5)}`,
        order: 0,
        created_at: new Date().toISOString(),
        category: determineDocumentCategory(name)
      };
      
      setAdminDocuments(prev => [newDocument, ...prev]);
      
      toast({
        title: "Document ajouté",
        description: `${name} a été ajouté avec succès.`,
      });
      
      return;
    }
    
    const document = adminDocuments.find(doc => doc.id === documentId);
    if (!document) {
      console.error(`Document with id ${documentId} not found`);
      return;
    }
    
    return baseHandleDocumentAction(document, action);
  }, [adminDocuments, baseHandleDocumentAction, toast]);
  
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
    handleDocumentAction,
    handleExportAll: handleExportAllFiltered,
    refreshDocuments,
    isLoading
  };
};

function getStatusLabelForDocument(type: string, status: string): string {
  if (status === "generated") {
    return "Document généré";
  }
  
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
