
/**
 * Service pour récupérer les données depuis l'API externe
 */
import { Client } from './types';

const EXTERNAL_API_URL = 'https://certicasa.mitain.com/api/prospects/';

/**
 * Récupère les prospects depuis l'API externe et les convertit en format Client
 */
export const fetchExternalProspects = async (): Promise<Client[]> => {
  try {
    console.log('Récupération des prospects depuis l\'API externe...');
    
    const response = await fetch(EXTERNAL_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }

    const prospects = await response.json();
    
    if (!Array.isArray(prospects)) {
      console.warn('La réponse de l\'API n\'est pas un tableau:', prospects);
      return [];
    }

    console.log(`${prospects.length} prospects récupérés depuis l'API externe`);

    // Mapper les prospects vers le format Client
    const clients: Client[] = prospects.map((prospect: any) => ({
      id: prospect.id?.toString() || `ext_${Math.random().toString(36).substr(2, 9)}`,
      name: buildClientName(prospect),
      email: prospect.email || '',
      phone: prospect.tel || prospect.telephone || '',
      address: prospect.adresse || '',
      nif: prospect.nif || '',
      type: prospect.type || 'RES010',
      status: "En cours",
      projects: 0,
      created_at: prospect.createdAt || new Date().toISOString(),
      // Enrichissement avec les nouveaux champs
      postalCode: extractPostalCode(prospect.adresse),
      ficheType: prospect.type || 'RES010',
      climateZone: prospect.zone_climatique || 'C',
      isolatedArea: prospect.surface_isolee || Math.floor(Math.random() * 100) + 20,
      isolationType: prospect.type_isolation || 'Combles',
      floorType: prospect.type_plancher || 'Bois',
      installationDate: prospect.date_pose || getRandomPastDate(),
      lotNumber: prospect.numero_lot || null,
      depositStatus: prospect.statut_depot || 'Non déposé',
      // Champs équipe
      teleprospector: prospect.teleprospecteur || '',
      confirmer: prospect.confirmeur || '',
      installationTeam: prospect.equipe_pose || '',
      delegate: prospect.delegue || '',
      depositDate: prospect.date_depot || '',
      entryChannel: prospect.canal_entree || 'Téléphone'
    }));

    return clients;
  } catch (error) {
    console.error('Erreur lors de la récupération des prospects externes:', error);
    throw new Error(`Impossible de récupérer les données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Construit le nom du client à partir des données du prospect
 */
const buildClientName = (prospect: any): string => {
  const prenom = prospect.prenom || '';
  const nom = prospect.nom || '';
  
  if (prenom && nom) {
    return `${prenom} ${nom}`.trim();
  } else if (nom) {
    return nom;
  } else if (prenom) {
    return prenom;
  } else {
    return 'Client sans nom';
  }
};

/**
 * Extrait le code postal de l'adresse
 */
const extractPostalCode = (address: string | undefined): string => {
  if (!address) return '';
  
  // Recherche un code postal à 5 chiffres dans l'adresse
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : '';
};

/**
 * Génère une date aléatoire dans le passé (pour les démos)
 */
const getRandomPastDate = (): string => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
  
  return pastDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
};
