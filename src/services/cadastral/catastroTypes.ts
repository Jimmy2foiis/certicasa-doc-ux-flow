export interface CatastroData {
  cadastralReference: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  climateZone?: string;
  [key: string]: any;
}
