
import type { SafetyCultureAudit, SafetyCulturePhoto, SafetyCultureConfig } from '@/types/safetyCulture';

class SafetyCultureServiceClass {
  private config: SafetyCultureConfig = {
    apiKey: '',
    baseUrl: 'https://api.safetyculture.io'
  };

  private getApiKey(): string {
    // Récupérer la clé API depuis le localStorage ou les paramètres
    const apiKey = localStorage.getItem('safetyCulture_apiKey');
    if (!apiKey) {
      throw new Error('Clé API SafetyCulture non configurée. Veuillez la configurer dans les paramètres.');
    }
    return apiKey;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const apiKey = this.getApiKey();
    
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SafetyCulture API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAudits(): Promise<SafetyCultureAudit[]> {
    try {
      const response = await this.makeRequest<{
        count: number;
        audits: SafetyCultureAudit[];
      }>('/audits/v1/audits?limit=50&order=desc');
      
      return response.audits || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des audits:', error);
      
      // Données de démo si l'API n'est pas disponible
      return this.getDemoAudits();
    }
  }

  async getAuditPhotos(auditId: string): Promise<SafetyCulturePhoto[]> {
    try {
      const response = await this.makeRequest<{
        audit: {
          items: Array<{
            id: string;
            type: string;
            responses?: {
              image?: {
                image_id: string;
                file_name: string;
                url: string;
                thumbnail_url: string;
              };
            };
            media?: SafetyCulturePhoto[];
          }>;
        };
      }>(`/audits/v1/audits/${auditId}`);

      const photos: SafetyCulturePhoto[] = [];
      
      // Parcourir les items pour extraire les photos
      response.audit.items.forEach(item => {
        // Photos dans les réponses
        if (item.responses?.image) {
          const imageResponse = item.responses.image;
          photos.push({
            id: imageResponse.image_id,
            url: imageResponse.url,
            thumbnail_url: imageResponse.thumbnail_url,
            title: imageResponse.file_name,
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
            file_size: 0,
            content_type: 'image/jpeg',
            item_id: item.id
          });
        }
        
        // Photos dans les médias
        if (item.media && Array.isArray(item.media)) {
          photos.push(...item.media);
        }
      });

      return photos;
    } catch (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      
      // Données de démo si l'API n'est pas disponible
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
    // Générer des photos de démo
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
