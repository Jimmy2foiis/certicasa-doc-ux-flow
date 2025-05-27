
import type { SafetyCultureAudit, SafetyCulturePhoto, SafetyCultureConfig } from '@/types/safetyCulture';
import { safetyCultureAPI } from './api.service';

class SafetyCultureServiceClass {
  private config: SafetyCultureConfig = {
    apiKey: '',
    baseUrl: 'https://cert.mitain.com/api'
  };

  private getApiKey(): string {
    // Récupérer la clé API depuis le localStorage ou les paramètres
    const apiKey = localStorage.getItem('safetyCulture_apiKey');
    if (!apiKey) {
      throw new Error('Clé API SafetyCulture non configurée. Veuillez la configurer dans les paramètres.');
    }
    return apiKey;
  }

  async getSafetyCultureReportURL(projectId: string): Promise<string | null> {
    try {
      // Utiliser la nouvelle API
      const response = await safetyCultureAPI.getInspectionDetails(projectId);
      
      return response.report_url || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport SafetyCulture:', error);
      return null;
    }
  }

  async getAudits(): Promise<SafetyCultureAudit[]> {
    try {
      const response = await safetyCultureAPI.getInspections({ limit: 50 });
      
      // Transformer les inspections en audits
      const audits = response.items?.map((inspection: any) => ({
        id: inspection.id,
        title: inspection.audit_title || inspection.site_name || 'Inspection sans titre',
        created_at: inspection.created_at,
        modified_at: inspection.modified_at,
        template_id: inspection.template_id,
        template_name: inspection.template_name,
        audit_owner: {
          id: inspection.owner_id,
          firstname: inspection.owner_firstname || 'Propriétaire',
          lastname: inspection.owner_lastname || 'Inconnu',
          email: inspection.owner_email || ''
        },
        site: {
          id: inspection.site_id,
          name: inspection.site_name || 'Site inconnu'
        }
      })) || [];
      
      return audits;
    } catch (error) {
      console.error('Erreur lors de la récupération des audits:', error);
      return [];
    }
  }

  async getAuditPhotos(auditId: string): Promise<SafetyCulturePhoto[]> {
    try {
      const response = await safetyCultureAPI.getInspectionAnswers(auditId);

      const photos: SafetyCulturePhoto[] = [];
      
      // Parcourir les réponses pour extraire les photos
      response.answers?.forEach((answer: any) => {
        if (answer.type === 'image' && answer.image_url) {
          photos.push({
            id: answer.id,
            url: answer.image_url,
            thumbnail_url: answer.thumbnail_url || answer.image_url,
            title: answer.title || 'Photo inspection',
            caption: answer.caption,
            created_at: answer.created_at,
            modified_at: answer.modified_at,
            file_size: answer.file_size || 0,
            content_type: 'image/jpeg',
            width: answer.width,
            height: answer.height,
            item_id: answer.item_id,
            question_id: answer.question_id
          });
        }
      });

      return photos;
    } catch (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      return [];
    }
  }

  setApiKey(apiKey: string): void {
    localStorage.setItem('safetyCulture_apiKey', apiKey);
    this.config.apiKey = apiKey;
  }

  getStoredApiKey(): string | null {
    return localStorage.getItem('safetyCulture_apiKey');
  }
}

export const SafetyCultureService = new SafetyCultureServiceClass();
