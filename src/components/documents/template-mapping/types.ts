
import { DocumentTemplate, TemplateTag, AvailableVariables } from "@/types/documents";

export interface TemplateVariableMappingProps {
  template: DocumentTemplate;
  clientData?: any;
  clientId?: string;
  onMappingComplete: (mappings: TemplateTag[]) => void;
}

// Exporter directement depuis ce fichier pour éviter les problèmes d'importation circulaire
export type { TemplateTag, AvailableVariables };

export const availableVariables: AvailableVariables = {
  client: ["nom", "prénom", "email", "téléphone", "adresse", "ville", "code_postal", "pays"],
  projet: ["nom", "type", "surface", "description", "date_début", "date_fin"],
  cadastre: ["référence", "coordonnées_utm", "utm_zone", "zone_climatique"],
  calcul: ["type", "résultat", "économie", "amélioration"],
  rdv: ["date", "heure", "lieu", "commercial", "notes"],
};
