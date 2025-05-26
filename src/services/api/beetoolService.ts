
/**
 * Service pour l'API Beetool (prospects)
 */

interface BeetoolProspect {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise?: string;
}

interface BeetoolProspectResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise?: string;
  created_at?: string;
  updated_at?: string;
}

const BEETOOL_BASE_URL = 'https://certicasa.mitain.com/api/prospects';

export class BeetoolService {
  /**
   * Récupère un prospect par son token Beetool
   */
  static async getProspect(beetoolToken: string): Promise<BeetoolProspectResponse | null> {
    try {
      const response = await fetch(`${BEETOOL_BASE_URL}/${beetoolToken}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Prospect avec token ${beetoolToken} non trouvé`);
          return null;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du prospect:', error);
      throw error;
    }
  }

  /**
   * Crée un nouveau prospect
   */
  static async createProspect(beetoolToken: string, prospectData: BeetoolProspect): Promise<BeetoolProspectResponse | null> {
    try {
      const response = await fetch(`${BEETOOL_BASE_URL}/${beetoolToken}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prospectData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du prospect:', error);
      throw error;
    }
  }

  /**
   * Modifie un prospect existant
   */
  static async updateProspect(beetoolToken: string, prospectData: Partial<BeetoolProspect>): Promise<BeetoolProspectResponse | null> {
    try {
      const response = await fetch(`${BEETOOL_BASE_URL}/${beetoolToken}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prospectData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la modification du prospect:', error);
      throw error;
    }
  }

  /**
   * Supprime un prospect
   */
  static async deleteProspect(beetoolToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${BEETOOL_BASE_URL}/${beetoolToken}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du prospect:', error);
      throw error;
    }
  }
}
