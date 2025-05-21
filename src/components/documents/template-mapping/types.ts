
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";

export type TemplateTag = { 
  tag: string;
  category: string;
  mappedTo: string;
};

export interface TagMapping {
  templateId: string;
  mappings: TemplateTag[];
}

export interface TagCategoryProps {
  category: string;
  onSelect: (variable: string) => void;
}

export interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

// Object containing all available variables by category
export const availableVariables = {
  client: ["name", "email", "phone", "address", "nif", "type", "status"],
  project: ["name", "type", "surface_area", "roof_area", "status", "created_at"],
  cadastre: ["utm_coordinates", "cadastral_reference", "climate_zone", "api_source"],
  calcul: ["type", "improvement", "surface", "date", "calculation_data"],
  document: ["name", "type", "status", "created_at"]
};
