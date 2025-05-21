
import { DocumentTemplate } from "@/types/documents";

export interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

// Re-export types from central type definition
export type { TemplateTag, TagMapping, TagCategoryProps } from "@/types/documents";
export { availableVariables } from "@/types/documents";

// Export type pour les composants de mapping
export interface MappingContentProps {
  loading: boolean;
  templateTags: TemplateTag[];
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  updateMapping: (index: number, value: string) => void;
  updateCategory: (index: number, category: string) => void;
  clientData?: any;
}
