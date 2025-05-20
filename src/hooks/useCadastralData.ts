
import { useState, useEffect } from 'react';

interface CadastralData {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les données cadastrales à partir d'une adresse
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
        // Simulation de l'appel API à l'API cadastrale espagnole
        // Dans un environnement de production, remplacer par l'appel réel à l'API
        console.log('Fetching cadastral data for address:', address);
        
        // Simuler un délai de réponse de l'API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Générer des données fictives basées sur l'adresse pour la démonstration
        // Convertir l'adresse en un nombre pour générer des données pseudo-aléatoires mais cohérentes
        let addressSum = 0;
        for (let i = 0; i < address.length; i++) {
          addressSum += address.charCodeAt(i);
        }
        
        // Générer des coordonnées UTM30 fictives
        const utmX = 430000 + (addressSum % 10000);
        const utmY = 4470000 + (addressSum % 10000);
        
        // Générer une référence cadastrale fictive au format espagnol (format 20 caractères)
        // Format typique: NNNNLLLNNNNLLNN (N=nombre, L=lettre)
        const number1 = Math.floor(addressSum % 10000).toString().padStart(4, '0');
        // Utiliser des lettres réelles pour le code postal (2 lettres)
        const postalLetters = String.fromCharCode(65 + (addressSum % 26)) + 
                            String.fromCharCode(65 + ((addressSum + 5) % 26));
        const number2 = Math.floor((addressSum * 7) % 10000).toString().padStart(4, '0');
        const sectorCode = String.fromCharCode(65 + ((addressSum + 10) % 26)) + 
                           String.fromCharCode(65 + ((addressSum + 15) % 26));
        const blockNumber = Math.floor((addressSum * 13) % 100).toString().padStart(2, '0');
        const parcelNumber = Math.floor((addressSum * 19) % 10000).toString().padStart(4, '0');
        const controlLetter = String.fromCharCode(65 + ((addressSum + 20) % 26));
        const propertyNumber = Math.floor((addressSum * 29) % 10000).toString().padStart(4, '0');
        
        // Format complet: exemple 2198OT5386001XY (similaire à la capture d'écran)
        const cadastralReference = `${number1}${postalLetters}${number2}${sectorCode}${blockNumber}${parcelNumber}${controlLetter}`;
        
        // Déterminer la zone climatique fictive basée sur l'adresse
        const climateZones = ['A3', 'A4', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'E1'];
        const climateZone = climateZones[addressSum % climateZones.length];
        
        setData({
          utmCoordinates: `${utmX}, ${utmY}`,
          cadastralReference: cadastralReference,
          climateZone: climateZone
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
