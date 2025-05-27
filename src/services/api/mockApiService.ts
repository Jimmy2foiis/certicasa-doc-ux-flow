
/**
 * Service mock pour tester l'application en attendant la résolution du problème CORS
 */
import { Client } from './types';

// Données simulées basées sur la structure de l'API réelle
const mockProspects = [
  {
    id: "986adda-8380-4262-be31-d7c1f292462c",
    beetoolToken: "928268",
    prenom: "Lourdes Moeses",
    nom: "Martin Cabreros",
    sexe: "",
    adresse: "Calle alonso castillo 43 24200 Valencia de Don Juan",
    codePostal: "24200",
    ville: "Valencia de Don Juan",
    lat: 42.2930864,
    lng: -5.5133332,
    status: "INITIALISATION_DONE_WAITING_FOR_CEE",
    createdAt: "2025-05-27T06:18:15.494Z",
    updatedAt: "2025-05-27T06:18:15.494Z"
  },
  {
    id: "d8c1b5e7-9b4e-4f17-bc60-6c1f9ecfa81b",
    beetoolToken: "923456",
    prenom: "Manuel",
    nom: "Garcia Lopez",
    sexe: "M",
    adresse: "Calle Mayor 15 28001 Madrid",
    codePostal: "28001",
    ville: "Madrid",
    lat: 40.4168,
    lng: -3.7038,
    status: "EN_COURS",
    createdAt: "2025-05-26T14:30:22.123Z",
    updatedAt: "2025-05-27T08:45:33.567Z"
  },
  {
    id: "e7f8a9b2-3c4d-4e5f-a678-9b1c2d3e4f5g",
    beetoolToken: "929123",
    prenom: "Carmen",
    nom: "Rodriguez Silva",
    sexe: "F",
    adresse: "Avenida Constitución 89 41001 Sevilla",
    codePostal: "41001",
    ville: "Sevilla",
    lat: 37.3891,
    lng: -5.9845,
    status: "FINALISE",
    createdAt: "2025-05-25T09:15:45.789Z",
    updatedAt: "2025-05-27T12:20:18.234Z"
  }
];

/**
 * Transforme les données mock en format Client
 */
const mapMockProspectToClient = (prospect: any): Client => ({
  id: prospect.id,
  name: `${prospect.prenom} ${prospect.nom}`,
  email: `${prospect.prenom.toLowerCase()}.${prospect.nom.toLowerCase()}@example.com`,
  phone: '',
  address: prospect.adresse,
  nif: '',
  type: 'RES010',
  status: prospect.status === 'FINALISE' ? 'Finalisé' : prospect.status === 'EN_COURS' ? 'En cours' : 'En attente',
  projects: 0,
  created_at: prospect.createdAt,
  postalCode: prospect.codePostal,
  ficheType: 'RES010',
  climateZone: 'C',
  isolatedArea: Math.floor(Math.random() * 100) + 20,
  isolationType: Math.random() > 0.5 ? 'Combles' : 'Rampants',
  floorType: Math.random() > 0.5 ? 'Bois' : 'Béton',
  installationDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  lotNumber: null,
  depositStatus: 'Non déposé',
  community: ['Madrid', 'Valencia', 'Andalucía'][Math.floor(Math.random() * 3)]
});

/**
 * Service mock pour récupérer les clients
 */
export const getMockClients = async (): Promise<Client[]> => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Utilisation des données mock en attendant la résolution du problème CORS');
  
  return mockProspects.map(mapMockProspectToClient);
};
