
/**
 * Type pour les données cadastrales
 */
export interface CatastroData {
  cadastralReference: string;
  utmCoordinates: string;
  climateZone: string;
  apiSource?: string;
  error?: string | null;
}
