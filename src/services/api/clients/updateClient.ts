
/**
 * Service for updating existing clients using Beetool API
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapClientToApiRequest, mapProspectToClient } from '../mappers/clientMapper';
import { BeetoolService } from '../beetoolService';

/**
 * Updates an existing client using Beetool API if ID looks like a token
 */
export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    // Si l'ID ressemble à un token Beetool, utiliser l'API Beetool
    if (clientId.length > 10) {
      const beetoolData: any = {};
      
      if (clientData.name) {
        const [prenom, ...nomParts] = clientData.name.split(' ');
        beetoolData.prenom = prenom || '';
        beetoolData.nom = nomParts.join(' ') || clientData.name;
      }
      
      if (clientData.email) beetoolData.email = clientData.email;
      if (clientData.phone) beetoolData.telephone = clientData.phone;
      if (clientData.nif) beetoolData.entreprise = clientData.nif;

      const beetoolResult = await BeetoolService.updateProspect(clientId, beetoolData);
      
      if (beetoolResult) {
        // Convertir la réponse Beetool en format Client
        return {
          id: clientId,
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
          depositStatus: clientData.depositStatus || 'Non déposé',
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
    
    const response = await httpClient.patch<any>(`/prospects/${clientId}/`, requestData);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la mise à jour du client ${clientId}:`, response.message);
      return null;
    }
    
    // Map API response back to Client model
    const client = mapProspectToClient(response.data);
    return client;
    
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${clientId}:`, error);
    return null;
  }
};
