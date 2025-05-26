
/**
 * Types pour l'API réelle
 */

// Type générique pour les réponses de l'API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message?: string;
}

// Type pour les prospects depuis votre API réelle
export interface Client {
  id?: string;
  beetoolToken: string; // Identifiant unique
  prenom: string;
  nom: string;
  sexe?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
  tel?: string;
  email?: string;
  cadastralReference?: string;
  utm30?: string;
  safetyCultureAuditId?: string;
  geoPosition?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Champs calculés pour la compatibilité avec l'interface existante
  name?: string; // Combinaison de prenom + nom
  phone?: string; // Alias pour tel
  address?: string; // Alias pour adresse
  
  // Champs hérités pour la compatibilité (optionnels)
  nif?: string;
  type?: string;
  projects?: number;
  created_at?: string;
  postalCode?: string;
  ficheType?: string;
  climateZone?: string;
  isolatedArea?: number;
  isolationType?: string;
  floorType?: string;
  installationDate?: string;
  lotNumber?: string | null;
  depositStatus?: string;
  community?: string;
  teleprospector?: string;
  confirmer?: string;
  installationTeam?: string;
  delegate?: string;
  depositDate?: string;
  entryChannel?: string;
}

// Type pour les données cadastrales
export interface CadastralData {
  id?: string;
  client_id: string;
  utm_coordinates?: string;
  cadastral_reference?: string;
  climate_zone?: string;
  api_source?: string;
  created_at?: string;
}

// Type pour les projets
export interface Project {
  id?: string;
  client_id: string;
  name: string;
  type?: string;
  status?: string;
  surface_area?: number;
  roof_area?: number;
  created_at?: string;
  completion_date?: string;
}

// Type pour les calculs
export interface Calculation {
  id?: string;
  project_id: string;
  before_layers?: any;
  after_layers?: any;
  project_type?: string;
  surface_area?: number;
  roof_area?: number;
  ventilation_before?: number;
  ventilation_after?: number;
  ratio_before?: number;
  ratio_after?: number;
  u_value_before?: number;
  u_value_after?: number;
  improvement_percent?: number;
  climate_zone?: string;
  created_at?: string;
  meets_requirements?: boolean;
}

// Type pour les documents
export interface Document {
  id?: string;
  project_id?: string;
  client_id?: string;
  name: string;
  type?: string;
  status?: string;
  file_path?: string;
  created_at?: string;
  content?: string;
}

// Type pour les lots
export interface Batch {
  id: string;
  name: string;
  status: string;
  client_count: number;
  created_at: string;
  submitted_at?: string;
}

// Type pour SafetyCulture
export interface SafetyCultureInspection {
  id: string;
  title: string;
  created_at: string;
  modified_at: string;
  template_id: string;
  template_name: string;
  audit_owner: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  site?: {
    id: string;
    name: string;
  };
}
