
import { useState, useEffect } from 'react';
import { getCadastralDataFromAddress } from '../services/catastroService';

interface CadastralData {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les données cadastrales à partir d'une adresse
 * en utilisant l'API officielle du Catastro Español
 */
export const useCadastralData = (address: string): CadastralData => {
  const [data, setData] = useState<Omit<CadastralData, 'isLoading' | 'error'>>({
    utmCoordinates: '',
    cadastralReference: '',
    climateZone: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'adresse est fournie et non vide
    if (!address || address.trim() === '') {
      return;
    }

    const fetchCadastralData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching cadastral data for address:', address);
        
        // Appeler le service pour obtenir les données cadastrales
        const cadastralInfo = await getCadastralDataFromAddress(address);
        
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
  }, [address]);

  return { ...data, isLoading, error };
};
