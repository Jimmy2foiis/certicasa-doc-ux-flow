
/**
 * Service for retrieving a single client by ID using Beetool API
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { getClients } from './getClients';
import { mapProspectToClient } from '../mappers/clientMapper';
import { BeetoolService } from '../beetoolService';

/**
 * Fetches a client by ID, trying Beetool API first if ID looks like a token
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    // Si l'ID ressemble à un token Beetool (chaîne longue), essayer l'API Beetool
    if (clientId.length > 10) {
      try {
        const beetoolProspect = await BeetoolService.getProspect(clientId);
        if (beetoolProspect) {
          // Convertir la réponse Beetool en format Client
          return {
            id: clientId,
            name: `${beetoolProspect.prenom} ${beetoolProspect.nom}`.trim(),
            email: beetoolProspect.email,
            phone: beetoolProspect.telephone,
            address: '', // Non disponible dans Beetool
            nif: '',
            type: 'RES010',
            status: "En cours",
            projects: 0,
            created_at: beetoolProspect.created_at || new Date().toISOString(),
            postalCode: '',
            ficheType: 'RES010',
            climateZone: 'C',
            isolatedArea: 0,
            isolationType: 'Combles',
            floorType: 'Bois',
            installationDate: '',
            lotNumber: null,
            depositStatus: 'Non déposé',
            teleprospector: '',
            confirmer: '',
            installationTeam: '',
            delegate: '',
            depositDate: '',
            entryChannel: 'Beetool'
          };
        }
      } catch (beetoolError) {
        console.warn('Erreur Beetool, tentative avec API interne:', beetoolError);
      }
    }

    // Fallback vers l'API interne
    const response = await httpClient.get<any>(`/prospects/${clientId}/`);
    
    if (!response.success || !response.data) {
      console.warn(`Endpoint détail non disponible pour le client ${clientId}. Tentative de fallback via la liste complète…`);

      // Fallback: get full list and filter
      const allClients = await getClients();
      const found = allClients.find((c) => c.id === clientId);
      if (found) return found;

      console.error(`Client ${clientId} introuvable même après fallback.`);
      return null;
    }
    
    // Map API data to Client model
    const client = mapProspectToClient(response.data);
    return client;

  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${clientId}:`, error);
    return null;
  }
};
