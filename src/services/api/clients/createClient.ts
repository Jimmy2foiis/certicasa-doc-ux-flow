
/**
 * Service for creating new clients using Beetool API
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapClientToApiRequest, mapProspectToClient } from '../mappers/clientMapper';
import { BeetoolService } from '../beetoolService';

/**
 * Creates a new client using Beetool API if token is provided, otherwise uses internal API
 */
export const createClientRecord = async (clientData: Client, beetoolToken?: string): Promise<Client | null> => {
  try {
    // Si un token Beetool est fourni, utiliser l'API Beetool
    if (beetoolToken) {
      const [prenom, ...nomParts] = (clientData.name || '').split(' ');
      const nom = nomParts.join(' ');
      
      const beetoolData = {
        nom: nom || clientData.name || '',
        prenom: prenom || '',
        email: clientData.email || '',
        telephone: clientData.phone || '',
        entreprise: clientData.nif || ''
      };

      const beetoolResult = await BeetoolService.createProspect(beetoolToken, beetoolData);
      
      if (beetoolResult) {
        // Convertir la réponse Beetool en format Client
        return {
          id: beetoolToken,
          name: `${beetoolResult.prenom} ${beetoolResult.nom}`.trim(),
          email: beetoolResult.email,
          phone: beetoolResult.telephone,
          address: clientData.address || '',
          nif: beetoolResult.entreprise || '',
          type: clientData.type || 'RES010',
          status: "En cours",
          projects: 0,
          created_at: beetoolResult.created_at || new Date().toISOString(),
          postalCode: clientData.postalCode || '',
          ficheType: clientData.ficheType || 'RES010',
          climateZone: clientData.climateZone || 'C',
          isolatedArea: clientData.isolatedArea || 0,
          isolationType: clientData.isolationType || 'Combles',
          floorType: clientData.floorType || 'Bois',
          installationDate: clientData.installationDate || '',
          lotNumber: clientData.lotNumber,
          depositStatus: 'Non déposé',
          teleprospector: clientData.teleprospector || '',
          confirmer: clientData.confirmer || '',
          installationTeam: clientData.installationTeam || '',
          delegate: clientData.delegate || '',
          depositDate: clientData.depositDate || '',
          entryChannel: 'Beetool'
        };
      }
    }

    // Fallback vers l'API interne
    const requestData = mapClientToApiRequest(clientData);
    
    const response = await httpClient.post<any>('/prospects/', requestData);
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la création du client:', response.message);
      return null;
    }
    
    // Map API response back to Client model
    const client = mapProspectToClient(response.data);
    return client;
    
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return null;
  }
};
