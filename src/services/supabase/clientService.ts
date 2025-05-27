
import { Client } from './types';

// Point de terminaison unique pour récupérer les prospects/clients - updated to cert.mitain.com
const PROSPECTS_ENDPOINT = 'https://cert.mitain.com/api/prospects/';

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

/**
 * Récupère la liste des clients depuis l'API distante.
 * Cette fonction ne dépend d'aucune base de données locale (Prisma/Supabase).
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await fetch(PROSPECTS_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Échec de la requête: ${response.status}`);
    }

    // On suppose que l'API renvoie un JSON de la forme Array<Prospect>
    const prospects: any[] = await response.json();

    // Adapter (mapper) chaque prospect vers l'interface Client utilisée dans le front
    const clients: Client[] = prospects.map((p) => ({
      id: p.id?.toString() ?? undefined,
      name: p.name || p.nom || '',
      email: p.email || '',
      phone: p.phone || p.telephone || '',
      address: p.address || p.adresse || '',
      nif: p.nif || '',
      type: p.type || '',
      status: p.status || '',
      projects: p.projects || 0,
      created_at: p.created_at || undefined,
    }));

    return clients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients depuis l'API:", error);
    return [];
  }
};

/**
 * Récupère un client par son identifiant en interrogeant la même API
 * (en attendant qu'un endpoint individuel soit disponible).
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  const clients = await getClients();
  return clients.find((c) => c.id === clientId) || null;
};

// ---------------------------------------------------------------------------
// Les opérations d'écriture ne sont pas encore disponibles côté API.
// On expose néanmoins les fonctions pour ne pas casser l'existant, mais
// elles lèveront une exception explicite afin d'éviter toute confusion.
// ---------------------------------------------------------------------------

export const createClientRecord = async (_clientData: Client): Promise<Client | null> => {
  throw new Error('createClientRecord: endpoint distant non encore disponible.');
};

export const updateClientRecord = async (
  _clientId: string,
  _clientData: Partial<Client>
): Promise<Client | null> => {
  throw new Error('updateClientRecord: endpoint distant non encore disponible.');
};

export const deleteClientRecord = async (_clientId: string): Promise<boolean> => {
  throw new Error('deleteClientRecord: endpoint distant non encore disponible.');
};
