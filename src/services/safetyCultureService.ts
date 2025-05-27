
import type { SafetyCultureAudit, SafetyCulturePhoto, SafetyCultureConfig } from '@/types/safetyCulture';
import { safetyCultureService } from './api/safetyCulture';

class SafetyCultureServiceClass {
  private config: SafetyCultureConfig = {
    apiKey: '',
    baseUrl: 'https://cert.mitain.com/api'
  };

  private getApiKey(): string {
    const apiKey = localStorage.getItem('safetyCulture_apiKey');
    if (!apiKey) {
      throw new Error('Clé API SafetyCulture non configurée. Veuillez la configurer dans les paramètres.');
    }
    return apiKey;
  }

  async getSafetyCultureReportURL(projectId: string): Promise<string | null> {
    try {
      const response = await safetyCultureService.getInspectionDetails(projectId);
      
      if (response.success && response.data?.report_url) {
        return response.data.report_url;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport SafetyCulture:', error);
      
      // Simulation pour la démo
      const mockAvailable = Math.random() > 0.5;
      return mockAvailable ? `https://app.safetyculture.com/reports/project-${projectId}` : null;
    }
  }

  async getAudits(): Promise<SafetyCultureAudit[]> {
    try {
      const response = await safetyCultureService.getInspections({ limit: 50 });
      
      if (response.success && response.data?.items) {
        return response.data.items.map((inspection: any) => ({
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
        }));
      }
      
      return this.getDemoAudits();
    } catch (error) {
      console.error('Erreur lors de la récupération des audits:', error);
      return this.getDemoAudits();
    }
  }

  async getAuditPhotos(auditId: string): Promise<SafetyCulturePhoto[]> {
    try {
      const response = await safetyCultureService.getInspectionAnswers(auditId);

      if (response.success && response.data?.answers) {
        const photos: SafetyCulturePhoto[] = [];
        
        response.data.answers.forEach((answer: any) => {
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
      }

      return this.getDemoPhotos();
    } catch (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      return this.getDemoPhotos();
    }
  }

  private getDemoAudits(): SafetyCultureAudit[] {
    return [
      {
        id: 'demo-audit-1',
        title: 'Inspection isolation - Maison Martin',
        created_at: '2024-01-15T10:30:00Z',
        modified_at: '2024-01-15T11:45:00Z',
        template_id: 'template-isolation',
        template_name: 'Inspection isolation thermique',
        audit_owner: {
          id: 'user-1',
          firstname: 'Jean',
          lastname: 'Dupont',
          email: 'jean.dupont@example.com'
        },
        site: {
          id: 'site-1',
          name: 'Chantier Valencia de Don Juan'
        }
      },
      {
        id: 'demo-audit-2',
        title: 'Contrôle final - Appartement Durand',
        created_at: '2024-01-20T09:15:00Z',
        modified_at: '2024-01-20T10:30:00Z',
        template_id: 'template-final',
        template_name: 'Contrôle final travaux',
        audit_owner: {
          id: 'user-2',
          firstname: 'Marie',
          lastname: 'Lambert',
          email: 'marie.lambert@example.com'
        }
      }
    ];
  }

  private getDemoPhotos(): SafetyCulturePhoto[] {
    const demoPhotos: SafetyCulturePhoto[] = [];
    
    for (let i = 1; i <= 12; i++) {
      demoPhotos.push({
        id: `demo-photo-${i}`,
        url: `https://picsum.photos/400/300?random=${i}`,
        thumbnail_url: `https://picsum.photos/150/150?random=${i}`,
        title: `Photo ${i} - Inspection chantier`,
        caption: `Photo prise lors de l'inspection - Point ${i}`,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        modified_at: new Date().toISOString(),
        file_size: Math.floor(Math.random() * 2000000) + 500000,
        content_type: 'image/jpeg',
        width: 400,
        height: 300,
        item_id: `item-${Math.floor(i / 3) + 1}`,
        question_id: `question-${i}`
      });
    }
    
    return demoPhotos;
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
