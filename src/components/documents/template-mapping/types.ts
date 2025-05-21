
import { DocumentTemplate } from "@/types/documents";

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

// Exporter directement depuis ce fichier pour éviter les problèmes d'importation circulaire
export interface AvailableVariables {
  [category: string]: string[];
}

export const availableVariables: AvailableVariables = {
  client: ["nom", "prénom", "email", "téléphone", "adresse", "ville", "code_postal", "pays"],
  projet: ["nom", "type", "surface", "description", "date_début", "date_fin"],
  cadastre: ["référence", "coordonnées_utm", "utm_zone", "zone_climatique"],
  calcul: ["type", "résultat", "économie", "amélioration"],
  rdv: ["date", "heure", "lieu", "commercial", "notes"],
};
