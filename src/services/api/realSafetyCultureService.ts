
/**
 * Service pour la vraie API SafetyCulture
 */

interface SafetyCultureInspection {
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

interface SafetyCultureAnswer {
  id: string;
  type: string;
  question_id: string;
  response: any;
  media_tokens?: string[];
}

interface SafetyCultureMediaResponse {
  url: string;
  content_type: string;
  file_size: number;
}

const SAFETYCULTURE_BASE_URL = 'https://certicasa.mitain.com/api/safety-culture';

export class RealSafetyCultureService {
  /**
   * Récupère la liste des inspections
   */
  static async getInspections(limit: number = 50): Promise<SafetyCultureInspection[]> {
    try {
      const response = await fetch(`${SAFETYCULTURE_BASE_URL}/inspections?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Aucune inspection trouvée');
          return [];
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.inspections || data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des inspections:', error);
      throw error;
    }
  }

  /**
   * Récupère les réponses d'une inspection avec les tokens des images
   */
  static async getInspectionAnswers(inspectionId: string): Promise<SafetyCultureAnswer[]> {
    try {
      const response = await fetch(`${SAFETYCULTURE_BASE_URL}/inspections/${inspectionId}/answers`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Aucune réponse trouvée pour l'inspection ${inspectionId}`);
          return [];
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.answers || data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
      throw error;
    }
  }

  /**
   * Génère l'URL de téléchargement d'un média avec son token
   */
  static getMediaDownloadUrl(mediaId: string, token: string): string {
    return `${SAFETYCULTURE_BASE_URL}/media/${mediaId}/download?token=${token}`;
  }

  /**
   * Récupère les métadonnées d'un média
   */
  static async getMediaMetadata(mediaId: string, token: string): Promise<SafetyCultureMediaResponse | null> {
    try {
      const response = await fetch(`${SAFETYCULTURE_BASE_URL}/media/${mediaId}/download?token=${token}`, {
        method: 'HEAD',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      return {
        url: response.url,
        content_type: response.headers.get('content-type') || 'image/jpeg',
        file_size: parseInt(response.headers.get('content-length') || '0', 10)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error);
      return null;
    }
  }
}
