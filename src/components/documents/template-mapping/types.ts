
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";

export interface TemplateTag {
  tag: string;
  category: string;
  mappedTo: string;
}

export interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

// Define available variables by category
export const availableVariables = {
  client: ["nom", "prénom", "email", "téléphone", "adresse", "ville", "code_postal", "pays"],
  projet: ["nom", "type", "surface", "description", "date_début", "date_fin"],
  cadastre: ["référence", "coordonnées_utm", "utm_zone", "zone_climatique"],
  calcul: ["type", "résultat", "économie", "amélioration"],
  rdv: ["date", "heure", "lieu", "commercial", "notes"],
};
