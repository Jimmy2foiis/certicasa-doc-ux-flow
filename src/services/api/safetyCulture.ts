
/**
 * Service API pour SafetyCulture - version nettoyée
 */
import { apiClient, ApiResponse } from './apiClient';

export interface InspectionParams {
  limit?: number;
  offset?: number;
}

export interface InspectionData {
  id: string;
  audit_title?: string;
  site_name?: string;
  created_at: string;
  modified_at: string;
  template_id: string;
  template_name?: string;
  owner_id: string;
  owner_firstname?: string;
  owner_lastname?: string;
  owner_email?: string;
  site_id?: string;
}

export interface InspectionListResponse {
  items?: InspectionData[];
  total?: number;
}

export interface InspectionAnswer {
  id: string;
  type: string;
  title?: string;
  caption?: string;
  image_url?: string;
  thumbnail_url?: string;
  created_at: string;
  modified_at: string;
  file_size?: number;
  width?: number;
  height?: number;
  item_id?: string;
  question_id?: string;
}

export interface InspectionAnswersResponse {
  answers?: InspectionAnswer[];
}

class SafetyCultureService {
  async getInspections(params: InspectionParams = {}): Promise<ApiResponse<InspectionListResponse>> {
    return apiClient.get<InspectionListResponse>('/safety-culture/inspections', params as any);
  }

  async getInspectionDetails(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/safety-culture/inspections/${id}`);
  }

  async getInspectionAnswers(id: string): Promise<ApiResponse<InspectionAnswersResponse>> {
    return apiClient.get<InspectionAnswersResponse>(`/safety-culture/inspections/${id}/answers`);
  }

  async getInspectionExtended(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/safety-culture/inspections/${id}/details`);
  }

  async getTemplates(params: Record<string, string> = {}): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/safety-culture/templates', params);
  }

  async getTemplateById(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/safety-culture/templates/${id}`);
  }

  async getTemplateModel(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/safety-culture/templates/${id}/model`);
  }

  async getTemplateByInspection(inspectionId: string, locale?: string): Promise<ApiResponse<any>> {
    const params = locale ? { locale } : {};
    return apiClient.get<any>(`/safety-culture/templates/inspections/${inspectionId}`, params);
  }

  getMediaDownloadUrl(id: string, token: string): string {
    return `${apiClient['baseUrl']}/safety-culture/media/${id}/download?token=${token}`;
  }
}

export const safetyCultureService = new SafetyCultureService();
