
// Types for administrative documents
import { DocumentStatus } from "@/models/documents";

// Type for documents returned from the database
export interface Document {
  id: string;
  name: string;
  type?: string;
  status?: string;
  file_path?: string;
  project_id?: string;
  client_id?: string;
  created_at?: string;
  content?: string;
}
