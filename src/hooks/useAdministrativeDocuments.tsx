
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AdministrativeDocument, DocumentStatus } from "@/models/documents";

export const useAdministrativeDocuments = (clientId?: string, clientName?: string) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Document list state
  const [adminDocuments, setAdminDocuments] = useState<AdministrativeDocument[]>([
    {
      id: "1",
      name: `Ficha RES010`,
      type: "ficha",
      description: "Document principal du dossier",
      status: "generated",
      order: 1
    },
    {
      id: "2",
      name: "Anexo I DR Subvenciones",
      type: "anexo",
      description: "Annexe pour les subventions",
      status: "ready",
      order: 2
    },
    {
      id: "3",
      name: "Factura",
      type: "factura",
      description: "Facture client",
      status: "pending",
      statusLabel: "En attente CAE",
      order: 3
    },
    {
      id: "4",
      name: "Rapport Photos (4-Fotos)",
      type: "fotos",
      description: "Photos de l'installation",
      status: "action-required",
      statusLabel: "Photos manquantes",
      order: 4
    },
    {
      id: "5",
      name: "Certificado Instalador (+ Calcul Coef.)",
      type: "certificado",
      description: "Certificat d'installation et calcul",
      status: "pending",
      statusLabel: "En attente CEE POST.",
      order: 5
    },
    {
      id: "6",
      name: "CEEE (Inicial & Final)",
      type: "ceee",
      description: "Certificats énergétiques",
      status: "missing",
      order: 6
    },
    {
      id: "7",
      name: "Modelo Cesión Ahorros",
      type: "modelo",
      description: "Modèle de cession",
      status: "ready",
      order: 7
    },
    {
      id: "8",
      name: "DNI Client",
      type: "dni",
      description: "Document d'identité",
      status: "linked",
      statusLabel: "Fichier lié",
      order: 8
    },
  ]);

  // Filtrer les documents selon la recherche et le filtre actif
  const filteredDocuments = useMemo(() => {
    let result = [...adminDocuments];
    
    // Appliquer la recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(query) || 
        doc.description.toLowerCase().includes(query) ||
        (doc.statusLabel && doc.statusLabel.toLowerCase().includes(query))
      );
    }
    
    // Appliquer le filtre de statut
    if (activeFilter) {
      switch(activeFilter) {
        case 'generated':
          result = result.filter(doc => doc.status === "generated" || doc.status === "linked");
          break;
        case 'ready':
          result = result.filter(doc => doc.status === "ready");
          break;
        case 'pending':
          result = result.filter(doc => doc.status === "pending" || doc.status === "action-required");
          break;
        case 'missing':
          result = result.filter(doc => doc.status === "missing");
          break;
      }
    }
    
    // Toujours trier par ordre
    return result.sort((a, b) => a.order - b.order);
  }, [adminDocuments, searchQuery, activeFilter]);

  // Fonction pour filtrer les documents
  const filterDocuments = (filter: string | null) => {
    setActiveFilter(filter);
  };

  // Update document type in the documents list when project type changes
  const updateProjectType = (projectType: string) => {
    if (!projectType) return;
    
    // Éviter les mises à jour inutiles
    const currentFicha = adminDocuments.find(doc => doc.type === "ficha");
    if (currentFicha && currentFicha.name === `Ficha ${projectType}`) return;
    
    setAdminDocuments(prev => 
      prev.map(doc => 
        doc.type === "ficha" 
          ? {...doc, name: `Ficha ${projectType}`}
          : doc
      )
    );
  };

  // Function to handle document actions
  const handleDocumentAction = (documentId: string, action: string) => {
    const document = adminDocuments.find(doc => doc.id === documentId);
    if (!document) return;
    
    // Actions based on the action type
    switch (action) {
      case "view":
        toast({
          title: `Visualisation: ${document.name}`,
          description: "Ouverture du document...",
        });
        break;
      case "download":
        toast({
          title: `Téléchargement: ${document.name}`,
          description: "Le document est en cours de téléchargement...",
        });
        break;
      case "generate":
        toast({
          title: `Génération: ${document.name}`,
          description: "Le document est en cours de génération...",
        });
        // Simulate successful generation
        setTimeout(() => {
          setAdminDocuments(prev => prev.map(doc => 
            doc.id === documentId ? {...doc, status: "generated" as DocumentStatus} : doc
          ));
          toast({
            title: "Document généré avec succès",
            description: `${document.name} a été généré et ajouté au dossier client.`,
          });
        }, 1500);
        break;
      case "regenerate":
        toast({
          title: `Régénération: ${document.name}`,
          description: "Le document est en cours de régénération...",
        });
        break;
      case "refresh-ocr":
        toast({
          title: `Mise à jour OCR: ${document.name}`,
          description: "Relance de l'analyse OCR en cours...",
        });
        break;
      case "update-cee":
        toast({
          title: `Mise à jour CEE: ${document.name}`,
          description: "Récupération des nouvelles données CEE...",
        });
        break;
      case "link-files":
      case "link-photos":
      case "link-dni":
        toast({
          title: `Liaison de fichiers: ${document.name}`,
          description: "Veuillez sélectionner les fichiers à lier...",
        });
        break;
    }
  };

  // Function to export all documents
  const handleExportAll = () => {
    toast({
      title: "Export du dossier complet",
      description: `Préparation de l'archive ZIP contenant tous les documents de ${clientName}...`,
    });
  };

  return {
    adminDocuments,
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    filterDocuments,
    handleDocumentAction,
    handleExportAll,
    updateProjectType
  };
};
