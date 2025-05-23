
import { AdministrativeDocument, DocumentStatus } from "@/types/documents";

// Function to determine the category of a document based on its name
export const determineDocumentCategory = (name: string): string => {
  const documentCategories = {
    "administratif": ["Contrat", "Facture", "Devis", "Certificat"],
    "technique": ["Plans", "Cadastre", "Calculs", "Rapports"],
    "commercial": ["Présentation", "Brochure", "Offre commerciale"]
  };
  
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

// Function to generate demo documents when no real documents are available
export const generateDemoDocuments = (clientName?: string, projectType: string = "RES010"): AdministrativeDocument[] => {
  const demoClient = clientName || "Demo Client";
  
  return [
    {
      id: "1",
      name: `Contrat - ${demoClient}`,
      type: "pdf",
      category: "administratif",
      status: "signed" as DocumentStatus,
      created_at: new Date().toISOString(),
      description: "Contrat client standard",
      order: 1
    },
    {
      id: "2",
      name: `Plans d'installation - Projet ${projectType}`,
      type: "dwg",
      category: "technique",
      status: "available" as DocumentStatus,
      created_at: new Date().toISOString(),
      description: "Plans techniques",
      order: 2
    },
    {
      id: "3",
      name: `Facture N°F20230001 - ${demoClient}`,
      type: "pdf",
      category: "administratif",
      status: "sent" as DocumentStatus,
      created_at: new Date().toISOString(),
      description: "Facture initiale",
      order: 3
    },
    {
      id: "4",
      name: `Rapport technique - Bilan énergétique`,
      type: "docx",
      category: "technique",
      status: "draft" as DocumentStatus,
      created_at: new Date().toISOString(),
      description: "Rapport d'analyse énergétique",
      order: 4
    },
    {
      id: "5",
      name: `Présentation commerciale - Solutions ${projectType}`,
      type: "pptx",
      category: "commercial",
      status: "available" as DocumentStatus,
      created_at: new Date().toISOString(),
      description: "Présentation de la solution",
      order: 5
    }
  ];
};
