
// Définitions de types centralisées pour les documents

// Type pour status de document (enum string)
export type DocumentStatus = 
  | "generated" 
  | "ready" 
  | "pending" 
  | "missing" 
  | "action-required" 
  | "error"
  | "linked"
  | "signed"
  | "available"
  | "sent"
  | "draft";

// Type de fichier supporté
export type SupportedFileType = "pdf" | "docx" | "xlsx" | "unknown";

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
  extractedText?: string;
  // Ajout des propriétés manquantes pour compatibilité avec Supabase
  extracted_text?: string | null;
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
  content: string | null;
  status?: string;
  progress?: number;
  lastModified?: number;
  extractedText?: string;
  variables?: string[];
  // Pour compatibilité avec les objets File natifs
  slice?: Function;
  stream?: Function;
  text?: Function;
  arrayBuffer?: Function;
}

// Type pour un document généré
export interface GeneratedDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  clientId?: string | null;
  projectId?: string | null;
  content?: string | null;
  createdAt: string;
}

// Type pour les documents administratifs
export interface AdministrativeDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  description: string;
  order: number;
  content?: string | null;
  file_path?: string | null;
  client_id?: string | null;
  project_id?: string | null;
  created_at?: string;
  statusLabel?: string;
  category?: string;
}

// Type Json pour utilisation avec Supabase
export type Json = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: Json } 
  | Json[];

// Variables disponibles par catégorie
export const availableVariables = {
  client: ["name", "adresse", "email", "phone", "address", "nif", "type", "status"],
  project: ["name", "type", "surface_area", "roof_area", "status", "created_at"],
  cadastre: ["utm_coordinates", "cadastral_reference", "climate_zone", "api_source"],
  calcul: ["type", "improvement", "surface", "date", "calculation_data"],
  document: ["name", "type", "status", "created_at"]
};

// Configuration pour l'extraction de variables
export interface VariableExtractionConfig {
  pattern: RegExp;
  categories: string[];
}

// Configuration par défaut pour l'extraction des variables
export const defaultVariablePatterns: VariableExtractionConfig[] = [
  { pattern: /\{\{([^}]+)\}\}/g, categories: ["client", "document"] },
  { pattern: /\$\{([^}]+)\}/g, categories: ["project", "cadastre"] },
  { pattern: /<%(.*?)%>/g, categories: ["calcul"] },
];

// Service d'extraction de texte
export interface TextExtractionResult {
  text: string;
  variables: string[];
  error?: string;
}

// Type pour le contenu d'un document
export type DocumentContentType = string | ArrayBuffer | null;

// Résultat d'une opération de document
export interface DocumentOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
