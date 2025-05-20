
import { CatastroData } from '../catastroTypes';
import { getClimateZoneByAddress } from '../climateZoneService';

// Cette fonction n'est plus utilisée dans l'approche optimisée, mais conservée 
// pour la compatibilité avec le code existant. Elle sera dépréciée.
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  console.warn('DÉPRÉCIÉ: getCadastralDataFromAddress est déconseillé. Utilisez la méthode par coordonnées.');
  return {
    utmCoordinates: '',
    cadastralReference: '',
    climateZone: getClimateZoneByAddress(address),
    apiSource: 'DEPRECATED',
    error: 'Méthode dépréciée. Utilisez l\'approche par géocodage puis coordonnées.'
  };
};
