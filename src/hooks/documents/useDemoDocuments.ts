
import type { AdministrativeDocument, DocumentStatus } from "@/types/documents";

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

// Cette fonction ne génère plus de documents de démonstration
// Elle retourne un tableau vide pour forcer l'utilisation des vraies APIs
export const generateDemoDocuments = (clientName?: string, projectType: string = "RES010"): AdministrativeDocument[] => {
  console.log("generateDemoDocuments appelée mais retourne un tableau vide - utilisation des vraies APIs uniquement");
  return [];
};
