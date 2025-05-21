
import { DocumentTemplate, AvailableVariables, availableVariables } from "@/types/documents";

export interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: any[]) => void;
}
