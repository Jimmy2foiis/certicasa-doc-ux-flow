
// Définitions de types centralisées pour les documents

// Type principal pour les modèles de document
export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  dateUploaded: string;
  lastModified: string;
  content: string | null;
  userId: string | null;
  file_path?: string;
  size?: number;
  variables?: string[];
  tags?: string[];
}

// Type pour les balises de modèle
export interface TemplateTag { 
  tag: string;
  category: string;
  mappedTo: string;
}

// Type pour le mapping de balises
export interface TagMapping {
  templateId: string;
  mappings: TemplateTag[];
}

// Type pour les propriétés des catégories de balises
export interface TagCategoryProps {
  category: string;
  onSelect: (variable: string) => void;
}

// Type pour les fichiers téléversés
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string | ArrayBuffer | null;
}

// Type pour un document généré
export interface GeneratedDocument {
  id: string;
  name: string;
  type: string;
  status: string;
  clientId?: string | null;
  projectId?: string | null;
  content?: string | null;
  createdAt: string;
}

// Variables disponibles par catégorie
export const availableVariables = {
  client: ["name", "email", "phone", "address", "nif", "type", "status"],
  project: ["name", "type", "surface_area", "roof_area", "status", "created_at"],
  cadastre: ["utm_coordinates", "cadastral_reference", "climate_zone", "api_source"],
  calcul: ["type", "improvement", "surface", "date", "calculation_data"],
  document: ["name", "type", "status", "created_at"]
};
