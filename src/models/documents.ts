
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

// Type for administrative documents
export interface AdministrativeDocument {
  id: string;
  name: string;
  type: string; // Unique identifier for the type (e.g., "ficha", "anexo", etc.)
  description: string;
  reference: string; // Added reference property
  status: DocumentStatus;
  statusLabel?: string;
  order: number;
  content?: string | null;
  file_path?: string | null;
  created_at?: string;
  category?: string;
}
