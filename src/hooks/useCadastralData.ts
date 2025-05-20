
import { useState, useEffect } from 'react';
import { getCadastralDataFromAddress, getCadastralInfoFromCoordinates, type CatastroData, type GeoCoordinates } from '../services/catastroService';

interface CadastralData {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  isLoading: boolean;
  error: string | null;
}

interface UseCadastralDataOptions {
  useDirectCoordinates?: boolean;
}

/**
 * Hook pour récupérer les données cadastrales à partir d'une adresse ou de coordonnées directes
 * en utilisant l'API officielle du Catastro Español
 */
export const useCadastralData = (
  address: string, 
  coordinates?: GeoCoordinates,
  options: UseCadastralDataOptions = {}
): CadastralData => {
  const [data, setData] = useState<Omit<CadastralData, 'isLoading' | 'error'>>({
    utmCoordinates: '',
    cadastralReference: '',
    climateZone: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { useDirectCoordinates = true } = options;

  useEffect(() => {
    // Si pas de coordonnées ni d'adresse, on ne fait rien
    if ((!address || address.trim() === '') && !coordinates) {
      return;
    }

    const fetchCadastralData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let cadastralInfo: CatastroData;

        // Si on a des coordonnées directes et l'option est activée, on les utilise directement
        // Cette approche est plus fiable car elle évite une étape de géocodage supplémentaire
        if (coordinates && useDirectCoordinates) {
          console.log('Récupération des données cadastrales avec coordonnées directes:', coordinates);
          cadastralInfo = await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng);
        } else {
          console.log('Récupération des données cadastrales à partir de l\'adresse:', address);
          cadastralInfo = await getCadastralDataFromAddress(address);
        }
        
        if (cadastralInfo.error) {
          throw new Error(cadastralInfo.error);
        }
        
        setData({
          utmCoordinates: cadastralInfo.utmCoordinates || '',
          cadastralReference: cadastralInfo.cadastralReference || '',
          climateZone: cadastralInfo.climateZone || ''
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des données cadastrales:', err);
        setError('Impossible de récupérer les données cadastrales. Veuillez vérifier l\'adresse et réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCadastralData();
  }, [address, coordinates, useDirectCoordinates]);

  return { ...data, isLoading, error };
};
