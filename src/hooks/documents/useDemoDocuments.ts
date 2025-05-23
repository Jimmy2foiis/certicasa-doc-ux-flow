import { useState } from "react";
import { AdministrativeDocument } from "@/types/documents";

export const useDemoDocuments = () => {
  const [demoDocuments, setDemoDocuments] = useState<AdministrativeDocument[]>([
    {
      id: "doc1",
      name: "Fiche d'identification",
      type: "identity",
      description: "Document d'identification du client",
      status: "generated",
      statusLabel: "Généré",
      order: 1,
      content: "...",
      category: "administrative", // Now properly typed
      created_at: "2023-05-15T09:30:00Z" // Now properly typed
    },
    {
      id: "doc2",
      name: "Contrat de vente",
      type: "contract",
      description: "Contrat de vente pour le projet",
      status: "ready",
      statusLabel: "Prêt",
      order: 2,
      content: "...",
      category: "contract", // Now properly typed
      created_at: "2023-05-16T10:15:00Z" // Now properly typed
    },
    {
      id: "doc3",
      name: "Annexe technique",
      type: "technical",
      description: "Détails techniques du projet",
      status: "pending",
      statusLabel: "En attente",
      order: 3,
      content: null,
      category: "technical", // Now properly typed
      created_at: "2023-05-17T14:45:00Z" // Now properly typed
    },
    {
      id: "doc4",
      name: "Facture d'acompte",
      type: "invoice",
      description: "Facture pour l'acompte initial",
      status: "action-required",
      statusLabel: "Action requise",
      order: 4,
      content: "...",
      category: "financial", // Now properly typed
      created_at: "2023-05-18T16:20:00Z" // Now properly typed
    },
    {
      id: "doc5",
      name: "Attestation de conformité",
      type: "compliance",
      description: "Attestation de conformité aux normes",
      status: "missing",
      statusLabel: "Manquant",
      order: 5,
      content: null,
      category: "certification", // Now properly typed
      created_at: "2023-05-19T11:10:00Z" // Now properly typed
    }
  ]);

  const addDocument = (newDocument: AdministrativeDocument) => {
    setDemoDocuments(prevDocuments => [...prevDocuments, newDocument]);
  };

  const updateDocument = (id: string, updatedDocument: Partial<AdministrativeDocument>) => {
    setDemoDocuments(prevDocuments =>
      prevDocuments.map(doc => (doc.id === id ? { ...doc, ...updatedDocument } : doc))
    );
  };

  const deleteDocument = (id: string) => {
    setDemoDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
  };

  return {
    demoDocuments,
    addDocument,
    updateDocument,
    deleteDocument
  };
};

export default useDemoDocuments;
