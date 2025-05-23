
// Import the TemplateTag from useDocumentGeneration
import { TemplateTag as DocumentGenerationTemplateTag } from "@/hooks/useDocumentGeneration";

// Update the TemplateTag interface to match the one from useDocumentGeneration
export interface TemplateTag extends DocumentGenerationTemplateTag {
  // Additional properties can be added here if needed in the future
  tag?: string;
  category?: string;
  mappedTo?: string;
}

// Export other types as needed
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags?: TemplateTag[];
  // Add additional properties that are used in the codebase
  dateUploaded?: string;
  lastModified?: string;
  userId?: string;
  size?: number;
}

export type DocumentStatus = 
  | "generated" 
  | "ready" 
  | "pending" 
  | "missing" 
  | "action-required" 
  | "error"
  | "linked";

// Type for administrative documents
export interface AdministrativeDocument {
  id: string;
  name: string;
  type: string; // Unique identifier for the type (e.g., "ficha", "anexo", etc.)
  description: string;
  status: DocumentStatus;
  statusLabel?: string;
  order: number;
  content?: string;
  category?: string; // Added to fix type errors
  created_at?: string; // Added to fix type errors
}

// Add additional types used by components
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  content: string | null;
  extractedText: string;
  variables: string[];
}

export interface TagMapping {
  [key: string]: string;
}

export interface TagCategoryProps {
  category: string;
  clientData?: any;
  onSelectVariable: (variable: string) => void;
}

export const availableVariables = {
  client: ["nom", "prénom", "adresse", "téléphone", "email"],
  project: ["nom", "description", "date_début", "date_fin"],
  calcul: ["surface", "prix_unitaire", "prix_total"],
  cadastre: ["référence", "parcelle", "commune"]
};

export interface TextExtractionResult {
  text: string;
  variables: string[];
  error?: string;
}

export interface VariableExtractionConfig {
  pattern: RegExp;
  name?: string;
  description?: string;
}

export const defaultVariablePatterns: VariableExtractionConfig[] = [
  { pattern: /\{\{([^}]+)\}\}/g, name: "Mustache" },
  { pattern: /\$([\w\.]+)\$/g, name: "Dollar" },
];
