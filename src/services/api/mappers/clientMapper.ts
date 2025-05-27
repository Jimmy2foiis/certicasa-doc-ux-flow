
/**
 * Mapper functions to transform data between API and application formats
 */
import { Client } from '../types';
import { extractPostalCode } from '../utils/addressUtils';
import { formatDate } from '../utils/dateUtils';

/**
 * Maps API prospect data to client model
 */
export const mapProspectToClient = (prospect: any): Client => {
  return {
    id: prospect.id?.toString() || '',
    name: prospect.prenom ? `${prospect.prenom} ${prospect.nom || ''}`.trim() : (prospect.nom || 'Client sans nom'),
    email: prospect.email || '',
    phone: prospect.tel || prospect.telephone || '',
    address: prospect.adresse || '',
    nif: prospect.nif || '',
    type: prospect.type || 'RES010',
    status: prospect.status || "En cours",
    projects: 0,
    created_at: prospect.createdAt || prospect.updatedAt || new Date().toISOString(),
    // Enrichir avec des données pour notre interface
    postalCode: prospect.codePostal || extractPostalCode(prospect.adresse),
    ficheType: prospect.type || 'RES010',
    climateZone: prospect.zone_climatique || 'C',
    isolatedArea: prospect.surface_isolee || 0,
    isolationType: prospect.type_isolation || 'Combles',
    floorType: prospect.type_plancher || 'Bois',
    installationDate: prospect.date_pose || formatDate(new Date()),
    lotNumber: prospect.numero_lot || null,
    depositStatus: prospect.statut_depot || 'Non déposé',
    community: prospect.ville || prospect.pays
  };
};

/**
 * Maps client model to API request format for creating/updating
 */
export const mapClientToApiRequest = (clientData: Partial<Client>): Record<string, any> => {
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
  
  return requestData;
};
