
/**
 * Types communs pour l'API
 */

// Type générique pour les réponses de l'API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// Type pour les prospects/clients
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nif?: string;
  type?: string;
  status?: string;
  projects?: number;
  created_at?: string;
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
}
