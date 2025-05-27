
/**
 * Service API pour les prospects - version nettoyée
 */
import { apiClient, ApiResponse } from './apiClient';

export interface ProspectData {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  tel: string;
  adresse: string;
  codePostal: string;
  ville: string;
  beetoolToken: string;
  status: string;
  createdAt: string;
}

export interface CreateProspectData {
  prenom: string;
  nom: string;
  email: string;
  tel: string;
  adresse: string;
  codePostal: string;
  ville: string;
}

export interface UpdateProspectData extends Partial<CreateProspectData> {
  adresse?: string;
  status?: string;
}

class ProspectsService {
  async getAll(): Promise<ApiResponse<ProspectData[]>> {
    return apiClient.get<ProspectData[]>('/prospects');
  }

  async getByToken(beetoolToken: string): Promise<ApiResponse<ProspectData>> {
    return apiClient.get<ProspectData>(`/prospects/${beetoolToken}`);
  }

  async create(beetoolToken: string, data: CreateProspectData): Promise<ApiResponse<ProspectData>> {
    return apiClient.post<ProspectData>(`/prospects/${beetoolToken}`, data);
  }

  async update(beetoolToken: string, data: UpdateProspectData): Promise<ApiResponse<ProspectData>> {
    return apiClient.patch<ProspectData>(`/prospects/${beetoolToken}`, data);
  }

  async delete(beetoolToken: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/prospects/${beetoolToken}`);
  }
}

export const prospectsService = new ProspectsService();
