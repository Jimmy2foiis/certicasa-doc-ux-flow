
// Client type definitions

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
}

export interface CadastralData {
  clientId: string;
  utmCoordinates?: string;
  cadastralReference?: string;
  climateZone?: string;
  apiSource?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: string;
  createdAt: string;
  description?: string;
}
