
import { DocumentTemplate, AvailableVariables } from "@/types/documents";

export interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

export interface TemplateTag {
  tag: string;
  category: string;
  mappedTo: string;
}

export { availableVariables } from "@/types/documents";
