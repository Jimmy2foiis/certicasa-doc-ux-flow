
/**
 * Service pour les APIs réelles Certicasa
 */
import { Client, SafetyCultureInspection } from './types';

const API_BASE_URL = 'https://certicasa.mitain.com/api';

// Fonction utilitaire pour les appels fetch avec gestion d'erreur
const apiCall = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de l'appel API ${url}:`, error);
    throw error;
  }
};

// Fonction pour transformer les données API en format Client unifié
const mapApiDataToClient = (apiData: any): Client => {
  return {
    ...apiData,
    // Mapping pour la compatibilité
    name: `${apiData.prenom || ''} ${apiData.nom || ''}`.trim(),
    phone: apiData.tel,
    address: apiData.adresse,
    postalCode: apiData.codePostal,
    created_at: apiData.createdAt,
    // Valeurs par défaut pour les champs requis par l'interface existante
    projects: 0,
    ficheType: 'RES010',
    climateZone: 'C',
    isolatedArea: 0,
    isolationType: 'Combles',
    floorType: 'Bois',
    depositStatus: 'Non déposé',
    entryChannel: 'API'
  };
};

export class RealApiService {
  /**
   * Récupérer un prospect par son beetoolToken
   */
  static async getProspect(beetoolToken: string): Promise<Client | null> {
    try {
      const data = await apiCall<any>(`${API_BASE_URL}/prospects/${beetoolToken}`);
      return mapApiDataToClient(data);
    } catch (error) {
      console.error(`Erreur lors de la récupération du prospect ${beetoolToken}:`, error);
      return null;
    }
  }

  /**
   * Créer un nouveau prospect
   */
  static async createProspect(beetoolToken: string, prospectData: Partial<Client>): Promise<Client | null> {
    try {
      const apiData = {
        prenom: prospectData.prenom || '',
        nom: prospectData.nom || '',
        sexe: prospectData.sexe || '',
        adresse: prospectData.adresse || prospectData.address || '',
        codePostal: prospectData.codePostal || prospectData.postalCode || '',
        ville: prospectData.ville || '',
        pays: prospectData.pays || 'Spain',
        tel: prospectData.tel || prospectData.phone || '',
        email: prospectData.email || '',
        status: prospectData.status || 'En cours'
      };

      const data = await apiCall<any>(`${API_BASE_URL}/prospects/${beetoolToken}`, {
        method: 'POST',
        body: JSON.stringify(apiData),
      });

      return mapApiDataToClient(data);
    } catch (error) {
      console.error(`Erreur lors de la création du prospect ${beetoolToken}:`, error);
      return null;
    }
  }

  /**
   * Mettre à jour un prospect existant
   */
  static async updateProspect(beetoolToken: string, prospectData: Partial<Client>): Promise<Client | null> {
    try {
      const apiData: any = {};
      
      if (prospectData.prenom !== undefined) apiData.prenom = prospectData.prenom;
      if (prospectData.nom !== undefined) apiData.nom = prospectData.nom;
      if (prospectData.sexe !== undefined) apiData.sexe = prospectData.sexe;
      if (prospectData.adresse !== undefined || prospectData.address !== undefined) {
        apiData.adresse = prospectData.adresse || prospectData.address;
      }
      if (prospectData.codePostal !== undefined || prospectData.postalCode !== undefined) {
        apiData.codePostal = prospectData.codePostal || prospectData.postalCode;
      }
      if (prospectData.ville !== undefined) apiData.ville = prospectData.ville;
      if (prospectData.pays !== undefined) apiData.pays = prospectData.pays;
      if (prospectData.tel !== undefined || prospectData.phone !== undefined) {
        apiData.tel = prospectData.tel || prospectData.phone;
      }
      if (prospectData.email !== undefined) apiData.email = prospectData.email;
      if (prospectData.status !== undefined) apiData.status = prospectData.status;

      const data = await apiCall<any>(`${API_BASE_URL}/prospects/${beetoolToken}`, {
        method: 'PATCH',
        body: JSON.stringify(apiData),
      });

      return mapApiDataToClient(data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du prospect ${beetoolToken}:`, error);
      return null;
    }
  }

  /**
   * Supprimer un prospect
   */
  static async deleteProspect(beetoolToken: string): Promise<boolean> {
    try {
      await apiCall(`${API_BASE_URL}/prospects/${beetoolToken}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du prospect ${beetoolToken}:`, error);
      return false;
    }
  }

  /**
   * Récupérer une inspection SafetyCulture
   */
  static async getSafetyCultureInspection(safetyCultureAuditId: string): Promise<SafetyCultureInspection | null> {
    try {
      const data = await apiCall<SafetyCultureInspection>(`${API_BASE_URL}/safety-culture/inspections/${safetyCultureAuditId}`);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'inspection ${safetyCultureAuditId}:`, error);
      return null;
    }
  }
}
