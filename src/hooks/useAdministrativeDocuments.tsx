
import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

export const useAdministrativeDocuments = (clientId?: string, clientName?: string) => {
  const [adminDocuments, setAdminDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectType, setProjectType] = useState<string>("RES010");
  const { toast } = useToast();

  // Function to refresh documents
  const refreshDocuments = useCallback(() => {
    fetchDocuments();
  }, []);

  // Fetch documents from Supabase
  const fetchDocuments = useCallback(async () => {
    if (!clientId) return;

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdminDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    }
  }, [clientId, toast]);

  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter documents based on search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return adminDocuments;
    
    return adminDocuments.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [adminDocuments, searchQuery]);

  // Filter documents by type
  const filterDocuments = useCallback((type: string) => {
    setSearchQuery(type);
  }, []);

  // Update project type
  const updateProjectType = useCallback((type: string) => {
    setProjectType(type);
  }, []);

  // Handle document actions (download, delete, etc.)
  const handleDocumentAction = useCallback(async (action: string, documentId: string) => {
    try {
      switch (action) {
        case "download":
          // Download logic
          toast({
            title: "Téléchargement",
            description: "Le téléchargement du document a commencé",
          });
          break;
          
        case "delete":
          // Delete logic
          const { error } = await supabase
            .from("documents")
            .delete()
            .eq("id", documentId);
            
          if (error) throw error;
          
          setAdminDocuments(prev => prev.filter(doc => doc.id !== documentId));
          
          toast({
            title: "Document supprimé",
            description: "Le document a été supprimé avec succès",
          });
          break;
          
        default:
          console.log(`Action ${action} not implemented`);
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      toast({
        title: "Erreur",
        description: `Impossible d'exécuter l'action ${action}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Export all documents
  const handleExportAll = useCallback(() => {
    toast({
      title: "Export en cours",
      description: `Export de ${filteredDocuments.length} documents pour ${clientName}`,
    });
    
    // Export logic would go here
    
  }, [filteredDocuments.length, clientName, toast]);

  return {
    adminDocuments,
    filteredDocuments,
    filterDocuments,
    handleDocumentAction,
    handleExportAll,
    searchQuery,
    setSearchQuery,
    updateProjectType,
    refreshDocuments
  };
};
