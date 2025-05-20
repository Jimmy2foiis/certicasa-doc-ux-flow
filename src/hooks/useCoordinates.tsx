
import { useState, useCallback, useEffect } from "react";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { useToast } from "@/components/ui/use-toast";

export const useCoordinates = () => {
  const { toast } = useToast();
  
  // État pour stocker les coordonnées (priorisées pour la récupération des données cadastrales)
  const [coordinates, setCoordinates] = useState<GeoCoordinates | undefined>(undefined);
  
  // Mettre à jour les coordonnées (obtenues via Google Maps Geocoding API)
  const setClientCoordinates = useCallback((newCoordinates: GeoCoordinates) => {
    console.log("Mise à jour des coordonnées client:", newCoordinates);
    setCoordinates(newCoordinates);
  }, []);

  // Afficher une notification lors de la mise à jour des coordonnées
  useEffect(() => {
    if (coordinates) {
      toast({
        title: "Coordonnées mises à jour",
        description: `Latitude: ${coordinates.lat.toFixed(6)}, Longitude: ${coordinates.lng.toFixed(6)}`,
        duration: 3000,
      });
    }
  }, [coordinates, toast]);

  return {
    coordinates,
    setClientCoordinates
  };
};
