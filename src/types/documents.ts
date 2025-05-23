// Import the TemplateTag from useDocumentGeneration
import { TemplateTag as DocumentGenerationTemplateTag } from "@/hooks/useDocumentGeneration";

// Update the TemplateTag interface to match the one from useDocumentGeneration
export interface TemplateTag extends DocumentGenerationTemplateTag {
  // Additional properties can be added here if needed in the future
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
}
