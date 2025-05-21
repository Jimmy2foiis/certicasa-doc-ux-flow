
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getDocumentsForClient } from "@/services/supabase/documentService";

// Types pour les documents administratifs
interface AdminDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  created_at: string;
  content?: string;
  file_path?: string;
}

// Catégories de documents administratifs
const documentCategories = {
  "administratif": ["Contrat", "Facture", "Devis", "Certificat"],
  "technique": ["Plans", "Cadastre", "Calculs", "Rapports"],
  "commercial": ["Présentation", "Brochure", "Offre commerciale"]
};

export const useAdministrativeDocuments = (clientId?: string, clientName?: string) => {
  const [adminDocuments, setAdminDocuments] = useState<AdminDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<AdminDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectType, setProjectType] = useState("RES010");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Charger les documents du client
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      
      try {
        if (clientId) {
          const documents = await getDocumentsForClient(clientId);
          
          // Transformer les documents en format AdminDocument
          const formattedDocs = documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type || "pdf",
            category: determineDocumentCategory(doc.name),
            status: doc.status || "available",
            created_at: doc.created_at,
            content: doc.content,
            file_path: doc.file_path
          }));
          
          setAdminDocuments(formattedDocs);
          setFilteredDocuments(formattedDocs);
        } else {
          // Si pas de clientId, charger des documents de démonstration
          const demoDocuments = generateDemoDocuments();
          setAdminDocuments(demoDocuments);
          setFilteredDocuments(demoDocuments);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents. Veuillez réessayer.",
          variant: "destructive",
        });
        
        // Charger des documents de démonstration en cas d'erreur
        const demoDocuments = generateDemoDocuments();
        setAdminDocuments(demoDocuments);
        setFilteredDocuments(demoDocuments);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [clientId, toast]);

  // Filtrer les documents en fonction de la recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDocuments(adminDocuments);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = adminDocuments.filter(doc => 
      doc.name.toLowerCase().includes(lowerCaseQuery) ||
      doc.category.toLowerCase().includes(lowerCaseQuery) ||
      doc.type.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredDocuments(filtered);
  }, [searchQuery, adminDocuments]);

  // Fonction pour déterminer la catégorie d'un document en fonction de son nom
  const determineDocumentCategory = (name: string): string => {
    const lowerCaseName = name.toLowerCase();
    
    for (const [category, keywords] of Object.entries(documentCategories)) {
      for (const keyword of keywords) {
        if (lowerCaseName.includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }
    
    return "administratif";
  };

  // Fonction pour générer des documents de démonstration
  const generateDemoDocuments = (): AdminDocument[] => {
    const demoClient = clientName || "Demo Client";
    
    return [
      {
        id: "1",
        name: `Contrat - ${demoClient}`,
        type: "pdf",
        category: "administratif",
        status: "signed",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        name: `Plans d'installation - Projet ${projectType}`,
        type: "dwg",
        category: "technique",
        status: "available",
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        name: `Facture N°F20230001 - ${demoClient}`,
        type: "pdf",
        category: "administratif",
        status: "sent",
        created_at: new Date().toISOString()
      },
      {
        id: "4",
        name: `Rapport technique - Bilan énergétique`,
        type: "docx",
        category: "technique",
        status: "draft",
        created_at: new Date().toISOString()
      },
      {
        id: "5",
        name: `Présentation commerciale - Solutions ${projectType}`,
        type: "pptx",
        category: "commercial",
        status: "available",
        created_at: new Date().toISOString()
      }
    ];
  };

  // Fonction pour mettre à jour le type de projet
  const updateProjectType = useCallback((type: string) => {
    setProjectType(type);
  }, []);

  // Fonction pour filtrer les documents
  const filterDocuments = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Fonction pour gérer les actions sur un document
  const handleDocumentAction = useCallback(async (documentId: string, action: string) => {
    try {
      const document = adminDocuments.find(doc => doc.id === documentId);
      
      if (!document) {
        toast({
          title: "Erreur",
          description: "Document non trouvé",
          variant: "destructive",
        });
        return;
      }
      
      switch (action) {
        case "download":
          toast({
            title: "Téléchargement",
            description: `Téléchargement de ${document.name} en cours...`,
          });
          // Simuler un téléchargement
          setTimeout(() => {
            toast({
              title: "Téléchargement terminé",
              description: `Le fichier ${document.name} a été téléchargé avec succès.`,
            });
          }, 1500);
          break;
          
        case "view":
          toast({
            title: "Aperçu du document",
            description: `Ouverture de ${document.name} en cours...`,
          });
          // Simuler l'ouverture d'un aperçu
          break;
          
        case "edit":
          toast({
            title: "Édition du document",
            description: `Préparation de l'édition pour ${document.name}...`,
          });
          // Simuler l'ouverture d'un éditeur
          break;
          
        case "share":
          toast({
            title: "Partage du document",
            description: `Préparation du partage pour ${document.name}...`,
          });
          // Simuler le partage d'un document
          break;
          
        default:
          console.log(`Action ${action} non implémentée`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
      toast({
        title: "Erreur",
        description: `Impossible d'exécuter l'action. Veuillez réessayer.`,
        variant: "destructive",
      });
    }
  }, [adminDocuments, toast]);

  // Fonction pour exporter tous les documents
  const handleExportAll = useCallback(() => {
    toast({
      title: "Export groupé",
      description: `Préparation de l'export de ${filteredDocuments.length} document(s)...`,
    });
    
    // Simuler un export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: `${filteredDocuments.length} document(s) exporté(s) avec succès.`,
      });
    }, 2000);
  }, [filteredDocuments, toast]);

  return {
    adminDocuments,
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    projectType,
    updateProjectType,
    filterDocuments,
    handleDocumentAction,
    handleExportAll,
    isLoading
  };
};
