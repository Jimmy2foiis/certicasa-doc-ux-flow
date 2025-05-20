
// Types pour les données
export interface Client {
  id?: string;
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

export interface CadastralData {
  id?: string;
  client_id: string;
  utm_coordinates?: string;
  cadastral_reference?: string;
  climate_zone?: string;
  api_source?: string;
  created_at?: string;
}

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
