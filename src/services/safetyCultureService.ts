
import type { SafetyCultureAudit, SafetyCulturePhoto, SafetyCultureConfig } from '@/types/safetyCulture';
import { RealSafetyCultureService } from './api/realSafetyCultureService';

class SafetyCultureServiceClass {
  private config: SafetyCultureConfig = {
    apiKey: '',
    baseUrl: 'https://certicasa.mitain.com/api/safety-culture'
  };

  async getAudits(): Promise<SafetyCultureAudit[]> {
    try {
      const inspections = await RealSafetyCultureService.getInspections(50);
      
      // Convertir les inspections en format SafetyCultureAudit
      return inspections.map(inspection => ({
        id: inspection.id,
        title: inspection.title,
        created_at: inspection.created_at,
        modified_at: inspection.modified_at,
        template_id: inspection.template_id,
        template_name: inspection.template_name,
        audit_owner: inspection.audit_owner,
        site: inspection.site
      }));
      
    } catch (error) {
      console.error('Erreur lors de la récupération des audits depuis l\'API réelle:', error);
      
      // Fallback vers les données de démo en cas d'erreur
      return this.getDemoAudits();
    }
  }

  async getAuditPhotos(auditId: string): Promise<SafetyCulturePhoto[]> {
    try {
      const answers = await RealSafetyCultureService.getInspectionAnswers(auditId);
      const photos: SafetyCulturePhoto[] = [];
      
      // Extraire les photos depuis les réponses
      answers.forEach(answer => {
        if (answer.media_tokens && answer.media_tokens.length > 0) {
          answer.media_tokens.forEach(token => {
            photos.push({
              id: `${answer.id}_${token}`,
              url: RealSafetyCultureService.getMediaDownloadUrl(answer.id, token),
              thumbnail_url: RealSafetyCultureService.getMediaDownloadUrl(answer.id, token),
              title: `Photo - Question ${answer.question_id}`,
              caption: `Photo de l'inspection`,
              created_at: new Date().toISOString(),
              modified_at: new Date().toISOString(),
              file_size: 0,
              content_type: 'image/jpeg',
              width: 400,
              height: 300,
              item_id: answer.id,
              question_id: answer.question_id
            });
          });
        }
      });

      if (photos.length === 0) {
        console.warn(`Aucune photo trouvée pour l'inspection ${auditId}`);
        return this.getDemoPhotos();
      }

      return photos;
      
    } catch (error) {
      console.error('Erreur lors de la récupération des photos depuis l\'API réelle:', error);
      
      // Fallback vers les données de démo
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
      }
    ];
  }

  private getDemoPhotos(): SafetyCulturePhoto[] {
    const demoPhotos: SafetyCulturePhoto[] = [];
    
    for (let i = 1; i <= 6; i++) {
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
