
import { useState, useEffect } from "react";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { AddressComponents } from "@/types/googleMaps";
import { useClientCadastralData } from "@/hooks/useClientCadastralData";

interface UseAddressFormLogicProps {
  client?: {
    address?: string;
    postalCode?: string;
    city?: string;
    province?: string;
    community?: string;
    climateZone?: string;
  } | null;
  onClimateZoneChange?: (climateData: {
    zone: string;
    confidence?: number;
    method?: string;
    referenceCity?: string;
    distance?: number;
    description?: string;
  }) => void;
}

export const useAddressFormLogic = ({ client, onClimateZoneChange }: UseAddressFormLogicProps) => {
  const [addressData, setAddressData] = useState({
    street: client?.address || "",
    postalCode: client?.postalCode || "",
    city: client?.city || "",
    province: client?.province || "",
    community: client?.community || "",
    utm: "",
    coordinates: "",
    cadastralReference: ""
  });

  const [gpsCoordinates, setGpsCoordinates] = useState<GeoCoordinates | undefined>();
  const [climateZone, setClimateZone] = useState(client?.climateZone || "");
  const [climateData, setClimateData] = useState<any>(null);

  // Utiliser le hook pour les données cadastrales
  const {
    utmCoordinates,
    cadastralReference,
    climateZone: detectedClimateZone,
    apiSource,
    loadingCadastral,
    refreshCadastralData
  } = useClientCadastralData("local_demo", addressData.street, gpsCoordinates);

  // Mettre à jour les données locales quand les données cadastrales arrivent
  useEffect(() => {
    if (cadastralReference) {
      setAddressData(prev => ({
        ...prev,
        cadastralReference
      }));
    }
  }, [cadastralReference]);

  useEffect(() => {
    if (utmCoordinates) {
      setAddressData(prev => ({
        ...prev,
        utm: utmCoordinates
      }));
    }
  }, [utmCoordinates]);

  const handleAddressSelected = (selectedAddress: string) => {
    setAddressData(prev => ({
      ...prev,
      street: selectedAddress
    }));
  };

  const handleCoordinatesSelected = (coords: { lat: number; lng: number }) => {
    setGpsCoordinates(coords);
    setAddressData(prev => ({
      ...prev,
      coordinates: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
    }));
  };

  const handleAddressComponentsSelected = (components: AddressComponents) => {
    setAddressData(prev => ({
      ...prev,
      postalCode: components.postalCode || prev.postalCode,
      city: components.city || prev.city,
      province: components.province || prev.province,
      community: components.community || prev.community
    }));

    // Transmettre les données de zone climatique au parent
    if (components.climateZone && onClimateZoneChange) {
      const climateInfo = {
        zone: components.climateZone,
        confidence: components.climateConfidence,
        method: components.climateMethod,
        referenceCity: components.climateReference,
        distance: components.climateDistance,
        description: components.climateDescription
      };
      
      setClimateZone(components.climateZone);
      setClimateData(climateInfo);
      onClimateZoneChange(climateInfo);
    }
  };

  const handleClimateZoneChange = (zone: string) => {
    setClimateZone(zone);
    if (onClimateZoneChange) {
      onClimateZoneChange({ zone });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    addressData,
    gpsCoordinates,
    climateZone,
    climateData,
    loadingCadastral,
    handleAddressSelected,
    handleCoordinatesSelected,
    handleAddressComponentsSelected,
    handleClimateZoneChange,
    handleInputChange
  };
};
