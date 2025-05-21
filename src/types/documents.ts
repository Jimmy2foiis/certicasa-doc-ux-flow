
// Types pour les documents administratifs
import { DocumentStatus } from "@/models/documents";

/**
 * Interface pour un document de base
 */
export interface BaseDocument {
  id: string;
  name: string;
  type?: string;
  status?: string;
  created_at?: string;
}

/**
 * Interface pour un document avec contenu et associations
 */
export interface Document extends BaseDocument {
  file_path?: string;
  project_id?: string;
  client_id?: string;
  content?: string;
}

/**
 * Interface pour un document template
 */
export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  dateUploaded: string;
  lastModified: string;
  content: string | null;
  userId: string | null;
}

/**
 * Interface pour un fichier uploadé
 */
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  progress: number;
  status: "uploading" | "complete" | "error";
  content: string | null;
  slice: any;
  stream: any;
  text: any;
  arrayBuffer: any;
}

/**
 * État de validation d'un template
 */
export type TemplateValidationState = 'empty' | 'invalid' | 'no-tags' | 'unknown';

/**
 * Interface pour une balise de template
 */
export interface TemplateTag {
  tag: string;
  category: string;
  mappedTo: string;
}

/**
 * Interface pour les catégories de variables disponibles
 */
export interface AvailableVariables {
  [category: string]: string[];
}

/**
 * Définition des variables disponibles par catégorie
 */
export const availableVariables: AvailableVariables = {
  client: ["nom", "prénom", "email", "téléphone", "adresse", "ville", "code_postal", "pays"],
  projet: ["nom", "type", "surface", "description", "date_début", "date_fin"],
  cadastre: ["référence", "coordonnées_utm", "utm_zone", "zone_climatique"],
  calcul: ["type", "résultat", "économie", "amélioration"],
  rdv: ["date", "heure", "lieu", "commercial", "notes"],
};
