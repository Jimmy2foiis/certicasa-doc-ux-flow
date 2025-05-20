
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
}
