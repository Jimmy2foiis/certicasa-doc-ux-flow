
/**
 * Service for retrieving client data
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';

// Données de démonstration pour tester l'interface
const mockClients: Client[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+34 600 123 456',
    address: 'Calle Mayor 123, 28001 Madrid',
    nif: '12345678A',
    type: 'RES010',
    status: 'En cours',
    projects: 1,
    created_at: '2024-01-15T10:30:00Z',
    postalCode: '28001',
    ficheType: 'RES010',
    climateZone: 'D',
    isolatedArea: 85,
    isolationType: 'Combles',
    floorType: 'Béton',
    installationDate: '2024-02-01',
    lotNumber: 'LOT-001',
    depositStatus: 'Déposé',
    community: 'Madrid'
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@email.com',
    phone: '+34 600 789 012',
    address: 'Avenida Diagonal 456, 08036 Barcelona',
    nif: '87654321B',
    type: 'RES020',
    status: 'Terminé',
    projects: 2,
    created_at: '2024-01-10T14:20:00Z',
    postalCode: '08036',
    ficheType: 'RES020',
    climateZone: 'C',
    isolatedArea: 120,
    isolationType: 'Rampants',
    floorType: 'Bois',
    installationDate: '2024-01-25',
    lotNumber: null,
    depositStatus: 'Non déposé',
    community: 'Cataluña'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+34 600 345 678',
    address: 'Calle Valencia 789, 46001 Valencia',
    nif: '11223344C',
    type: 'RES010',
    status: 'En cours',
    projects: 1,
    created_at: '2024-01-20T09:15:00Z',
    postalCode: '46001',
    ficheType: 'RES010',
    climateZone: 'B',
    isolatedArea: 65,
    isolationType: 'Combles',
    floorType: 'Béton',
    installationDate: '2024-02-10',
    lotNumber: 'LOT-002',
    depositStatus: 'En attente',
    community: 'Valencia'
  }
];

/**
 * Fetches all clients from the API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    console.log('Chargement des clients depuis l\'API...');
    
    // Tentative de récupération depuis l'API
    const response = await httpClient.get<any[]>('/prospects/');
    
    if (response.success && response.data) {
      // Map API data to Client model
      const clients = response.data.map(mapProspectToClient);
      console.log(`${clients.length} clients récupérés depuis l'API`);
      return clients;
    } else {
      console.warn('Aucune donnée reçue de l\'API, utilisation des données de démonstration');
      return mockClients;
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    console.log("Utilisation des données de démonstration pour tester l'interface");
    return mockClients;
  }
};
