
// Interface pour les données cadastrales
export interface CatastroData {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  error: string | null;
}
