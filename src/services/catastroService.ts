import { GeoCoordinates } from './geoCoordinatesService';
import { 
  getCadastralInfoFromCoordinates,
  refreshCadastralData 
} from './cadastral/catastroCoordinatesService';
import { getCadastralDataFromAddress } from './cadastral/catastroLegacyService';
import { getCachedCadastralData, setCachedCadastralData, clearCadastralCache } from './cadastral/catastroCache';
import { CatastroData } from './catastroTypes';

// Re-export des types et fonctions
export type { CatastroData };
export { 
  getCadastralInfoFromCoordinates, 
  refreshCadastralData,
  getCadastralDataFromAddress,
  getCachedCadastralData,
  setCachedCadastralData,
  clearCadastralCache
};
