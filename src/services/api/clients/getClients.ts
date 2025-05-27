
/**
 * Service for retrieving client data
 */
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';
import { API_BASE_URL } from '../config';
import { getMockClients } from '../mockApiService';

/**
 * Helper function for fetch requests
 */
const fetchAPI = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetches external prospects from Safety Culture API
 */
const fetchExternalProspects = async (): Promise<Client[]> => {
  try {
    const inspections = await fetchAPI('/safety-culture/inspections?limit=50');
    
    return inspections.items?.map((inspection: any) => ({
      id: inspection.id,
      name: inspection.site_name || 'Sans nom',
      email: inspection.audit_owner?.email || '',
      phone: '',
      address: '',
      nif: '',
      type: 'RES010',
      status: "En cours",
      projects: 0,
      created_at: inspection.created_at || new Date().toISOString(),
      postalCode: '',
      ficheType: 'RES010',
      climateZone: 'C',
      isolatedArea: Math.floor(Math.random() * 100) + 20,
      isolationType: 'Combles',
      floorType: 'Bois',
      installationDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      lotNumber: null,
      depositStatus: 'Non déposé'
    })) || [];
  } catch (error) {
    console.warn('Erreur lors de la récupération depuis l\'API externe:', error);
    return [];
  }
};

/**
 * Fetches all clients from both the external API and internal API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    console.log('Chargement des clients depuis les APIs...');
    
    // Récupérer les clients depuis l'API externe
    let externalClients: Client[] = [];
    try {
      externalClients = await fetchExternalProspects();
      console.log(`${externalClients.length} clients récupérés depuis l'API externe`);
    } catch (externalError) {
      console.warn('Erreur lors de la récupération depuis l\'API externe, continuons avec l\'API interne seulement:', externalError);
    }
    
    // Récupérer les clients depuis l'API interne
    let internalClients: Client[] = [];
    try {
      const response = await fetchAPI('/prospects/');
      
      if (response && Array.isArray(response)) {
        // Map API data to Client model
        internalClients = response.map(mapProspectToClient);
        console.log(`${internalClients.length} clients récupérés depuis l'API interne`);
      }
    } catch (internalError) {
      console.warn('Erreur lors de la récupération depuis l\'API interne:', internalError);
      
      // Si toutes les APIs échouent, utiliser les données mock
      if (externalClients.length === 0) {
        console.log('Utilisation des données mock en raison des erreurs CORS');
        const mockClients = await getMockClients();
        return mockClients;
      }
    }
    
    // Combiner les deux sources en évitant les doublons
    const allClients = [...externalClients];
    
    // Ajouter les clients internes qui ne sont pas déjà présents
    internalClients.forEach(internalClient => {
      const exists = externalClients.some(extClient => 
        extClient.id === internalClient.id || 
        (extClient.email && internalClient.email && extClient.email === internalClient.email)
      );
      
      if (!exists) {
        allClients.push(internalClient);
      }
    });
    
    console.log(`Total: ${allClients.length} clients disponibles`);
    return allClients;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    
    // En cas d'erreur totale, utiliser les données mock
    console.log('Utilisation des données mock de secours');
    return await getMockClients();
  }
};
