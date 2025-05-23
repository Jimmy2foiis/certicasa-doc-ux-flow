
/**
 * Service pour la gestion des clients via l'API REST externe
 * URL: https://certicasa.mitain.com/api/prospects/
 */
import { httpClient } from './httpClient';
import { ApiResponse, Client } from './types';

/**
 * Récupère tous les clients depuis l'API externe
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await httpClient.get<any[]>('/prospects/');
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la récupération des clients:', response.message);
      return [];
    }
    
    // Adapter le format des données de l'API externe à notre modèle Client
    const clients: Client[] = response.data.map((prospect: any) => ({
      id: prospect.id?.toString() || '',
      name: prospect.prenom ? `${prospect.prenom} ${prospect.nom || ''}`.trim() : (prospect.nom || 'Client sans nom'),
      email: prospect.email || '',
      phone: prospect.tel || prospect.telephone || '',
      address: prospect.adresse || '',
      nif: prospect.nif || '',
      type: prospect.type || 'RES010',
      status: "En cours",
      projects: 0,
      created_at: prospect.createdAt || new Date().toISOString(),
      // Enrichir avec des données pour notre nouvelle interface
      postalCode: extractPostalCode(prospect.adresse),
      ficheType: prospect.type || 'RES010',
      climateZone: prospect.zone_climatique || 'C',
      isolatedArea: prospect.surface_isolee || Math.floor(Math.random() * 100) + 20,
      isolationType: prospect.type_isolation || 'Combles',
      floorType: prospect.type_plancher || 'Bois',
      installationDate: prospect.date_pose || formatDate(new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))),
      lotNumber: prospect.numero_lot || null,
      depositStatus: prospect.statut_depot || 'Non déposé'
    }));

    return clients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return [];
  }
};

/**
 * Récupère un client par son identifiant
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    // La plupart des APIs REST exposent la vue détail avec un slash final
    const response = await httpClient.get<any>(`/prospects/${clientId}/`);
    
    if (!response.success || !response.data) {
      console.warn(`Endpoint détail non disponible pour le client ${clientId}. Tentative de fallback via la liste complète…`);

      // Fallback : récupérer la liste et filtrer
      const allClients = await getClients();
      const found = allClients.find((c) => c.id === clientId);
      if (found) return found;

      console.error(`Client ${clientId} introuvable même après fallback.`);
      return null;
    }
    
    const prospect = response.data;
    
    // Adapter le format des données
    const client: Client = {
      id: prospect.id?.toString() || '',
      name: prospect.prenom ? `${prospect.prenom} ${prospect.nom || ''}`.trim() : (prospect.nom || 'Client sans nom'),
      email: prospect.email || '',
      phone: prospect.tel || prospect.telephone || '',
      address: prospect.adresse || '',
      nif: prospect.nif || '',
      type: prospect.type || 'RES010',
      status: "En cours",
      projects: 0,
      created_at: prospect.createdAt || new Date().toISOString(),
      // Enrichir avec des données pour notre nouvelle interface
      postalCode: extractPostalCode(prospect.adresse),
      ficheType: prospect.type || 'RES010',
      climateZone: prospect.zone_climatique || 'C',
      isolatedArea: prospect.surface_isolee || Math.floor(Math.random() * 100) + 20,
      isolationType: prospect.type_isolation || 'Combles',
      floorType: prospect.type_plancher || 'Bois',
      installationDate: prospect.date_pose || formatDate(new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))),
      lotNumber: prospect.numero_lot || null,
      depositStatus: prospect.statut_depot || 'Non déposé'
    };

    return client;
  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${clientId}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau client
 */
export const createClientRecord = async (clientData: Client): Promise<Client | null> => {
  try {
    // Transformer les données au format attendu par l'API
    const requestData = {
      prenom: clientData.name.split(' ').slice(0, -1).join(' ') || clientData.name,
      nom: clientData.name.split(' ').slice(-1).join(' ') || '',
      email: clientData.email || '',
      tel: clientData.phone || '',
      adresse: clientData.address || '',
      nif: clientData.nif || '',
      type: clientData.ficheType || clientData.type || 'RES010',
      zone_climatique: clientData.climateZone || 'C',
      type_isolation: clientData.isolationType || 'Combles',
      type_plancher: clientData.floorType || 'Bois',
    };
    
    const response = await httpClient.post<any>('/prospects/', requestData);
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la création du client:', response.message);
      return null;
    }
    
    const createdProspect = response.data;
    
    // Adapter le format des données de retour
    const client: Client = {
      id: createdProspect.id?.toString() || '',
      name: createdProspect.prenom ? `${createdProspect.prenom} ${createdProspect.nom || ''}`.trim() : (createdProspect.nom || 'Client sans nom'),
      email: createdProspect.email || '',
      phone: createdProspect.tel || createdProspect.telephone || '',
      address: createdProspect.adresse || '',
      nif: createdProspect.nif || '',
      type: createdProspect.type || 'RES010',
      status: "En cours",
      projects: 0, 
      created_at: createdProspect.createdAt || new Date().toISOString(),
      // Enrichir avec des données pour notre nouvelle interface
      postalCode: extractPostalCode(createdProspect.adresse),
      ficheType: createdProspect.type || 'RES010',
      climateZone: createdProspect.zone_climatique || 'C',
      isolatedArea: createdProspect.surface_isolee || Math.floor(Math.random() * 100) + 20,
      isolationType: createdProspect.type_isolation || 'Combles',
      floorType: createdProspect.type_plancher || 'Bois',
      installationDate: createdProspect.date_pose || formatDate(new Date()),
      lotNumber: createdProspect.numero_lot || null,
      depositStatus: 'Non déposé'
    };

    return client;
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return null;
  }
};

/**
 * Met à jour un client existant
 */
export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    // Transformer les données au format attendu par l'API
    const requestData: Record<string, any> = {};
    
    if (clientData.name) {
      const nameParts = clientData.name.split(' ');
      requestData.prenom = nameParts.slice(0, -1).join(' ') || clientData.name;
      requestData.nom = nameParts.slice(-1).join(' ') || '';
    }
    
    if (clientData.email) requestData.email = clientData.email;
    if (clientData.phone) requestData.tel = clientData.phone;
    if (clientData.address) requestData.adresse = clientData.address;
    if (clientData.nif) requestData.nif = clientData.nif;
    if (clientData.ficheType) requestData.type = clientData.ficheType;
    if (clientData.climateZone) requestData.zone_climatique = clientData.climateZone;
    if (clientData.isolationType) requestData.type_isolation = clientData.isolationType;
    if (clientData.floorType) requestData.type_plancher = clientData.floorType;
    
    const response = await httpClient.patch<any>(`/prospects/${clientId}/`, requestData);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la mise à jour du client ${clientId}:`, response.message);
      return null;
    }
    
    const updatedProspect = response.data;
    
    // Adapter le format des données
    const client: Client = {
      id: updatedProspect.id?.toString() || '',
      name: updatedProspect.prenom ? `${updatedProspect.prenom} ${updatedProspect.nom || ''}`.trim() : (updatedProspect.nom || 'Client sans nom'),
      email: updatedProspect.email || '',
      phone: updatedProspect.tel || updatedProspect.telephone || '',
      address: updatedProspect.adresse || '',
      nif: updatedProspect.nif || '',
      type: updatedProspect.type || 'RES010',
      status: "En cours",
      projects: 0,
      created_at: updatedProspect.createdAt || new Date().toISOString(),
      // Enrichir avec des données pour notre nouvelle interface
      postalCode: extractPostalCode(updatedProspect.adresse),
      ficheType: updatedProspect.type || 'RES010',
      climateZone: updatedProspect.zone_climatique || 'C',
      isolatedArea: updatedProspect.surface_isolee || Math.floor(Math.random() * 100) + 20,
      isolationType: updatedProspect.type_isolation || 'Combles',
      floorType: updatedProspect.type_plancher || 'Bois',
      installationDate: updatedProspect.date_pose || formatDate(new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))),
      lotNumber: updatedProspect.numero_lot || null,
      depositStatus: updatedProspect.statut_depot || 'Non déposé'
    };

    return client;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${clientId}:`, error);
    return null;
  }
};

/**
 * Supprime un client
 */
export const deleteClientRecord = async (clientId: string): Promise<boolean> => {
  try {
    const response = await httpClient.delete<any>(`/prospects/${clientId}/`);
    return response.success;
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${clientId}:`, error);
    return false;
  }
};

/**
 * Utilitaires
 */

// Extrait le code postal d'une adresse
const extractPostalCode = (address?: string): string => {
  if (!address) return "";
  const matches = address.match(/\b\d{5}\b/);
  return matches && matches[0] ? matches[0] : "";
};

// Formate une date au format YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
