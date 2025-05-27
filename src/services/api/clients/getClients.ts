
/**
 * Service pour récupérer les données clients - refactorisé avec native fetch
 */
import { Client } from '../types';

/**
 * Récupère tous les clients depuis l'API avec native fetch
 */
export const getClients = async (): Promise<Client[]> => {
  console.group('🚀 getClients() - Native fetch');

  try {
    // Fetch all prospects (without specific token)
    const response = await fetch('https://cert.mitain.com/api/prospects/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const rawProspects = await response.json();
    
    if (!Array.isArray(rawProspects)) {
      throw new Error('La réponse attendue devait être un tableau.');
    }
    
    // Convert prospects to client format
    const clients = rawProspects.map(prospect => ({
      id: prospect.id || prospect.beetoolToken,
      name: `${prospect.firstName || ''} ${prospect.lastName || ''}`.trim() || 'Sans nom',
      type: prospect.propertyType || 'Type inconnu',
      status: prospect.status || 'En cours',
      projects: 0,
      created_at: prospect.createdAt || new Date().toISOString(),
      // Additional fields mapped from prospect data
      address: prospect.address || '',
      postalCode: prospect.postalCode || '',
      email: prospect.email || '',
      phone: prospect.phone || '',
      nif: prospect.nif || '',
      ficheType: prospect.propertyType || 'RES010',
      climateZone: prospect.zone || 'C',
      isolatedArea: prospect.surface || 0,
      isolationType: prospect.insulationType || 'Combles',
      floorType: prospect.floorType || 'Bois',
      installationDate: prospect.installationDate || new Date().toISOString().split('T')[0],
      lotNumber: prospect.lotNumber || null,
      depositStatus: prospect.depositStatus || 'Non déposé',
      community: prospect.community || prospect.city || ''
    }));

    console.log(`✅ ${clients.length} clients loaded successfully`);
    return clients;
    
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    throw new Error(`Failed to retrieve clients: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    console.groupEnd();
  }
};
