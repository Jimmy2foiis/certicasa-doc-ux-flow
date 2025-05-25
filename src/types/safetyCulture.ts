
export interface SafetyCultureAudit {
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

export interface SafetyCulturePhoto {
  id: string;
  url: string;
  thumbnail_url?: string;
  title?: string;
  caption?: string;
  created_at: string;
  modified_at: string;
  file_size: number;
  content_type: string;
  width?: number;
  height?: number;
  item_id?: string;
  question_id?: string;
}

export interface SelectedPhoto {
  photo: SafetyCulturePhoto;
  order: number;
}

export interface PhotosReportData {
  clientName: string;
  projectTitle: string;
  auditDate: string;
  photosAvant: SelectedPhoto[];
  photosApres: SelectedPhoto[];
}

export interface SafetyCultureConfig {
  apiKey: string;
  baseUrl: string;
}
