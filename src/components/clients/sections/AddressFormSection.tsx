import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import AddressSearch from "@/components/clients/AddressSearch";
import { AddressComponents } from "@/types/googleMaps";
import { useClientCadastralData } from "@/hooks/useClientCadastralData";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface AddressFormSectionProps {
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

const AddressFormSection = ({ client, onClimateZoneChange }: AddressFormSectionProps) => {
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

  // Utiliser le hook pour les données cadastrales
  const {
    utmCoordinates,
    cadastralReference,
    climateZone,
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
      onClimateZoneChange({
        zone: components.climateZone,
        confidence: components.climateConfidence,
        method: components.climateMethod,
        referenceCity: components.climateReference,
        distance: components.climateDistance,
        description: components.climateDescription
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="border-b pb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Adresse complète
      </h3>
      
      {/* Ligne 1: Rue, Code postal, Ville */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <AddressSearch
            initialAddress={addressData.street}
            onAddressChange={(address) => handleInputChange('street', address)}
            onCoordinatesChange={handleCoordinatesSelected}
            onAddressComponentsChange={handleAddressComponentsSelected}
          />
        </div>
        <div>
          <Input 
            value={addressData.postalCode} 
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="Code postal" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <Input 
            value={addressData.city} 
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Ville" 
            className="text-sm h-8" 
          />
        </div>
      </div>

      {/* Ligne 2: Province, Communauté autonome, UTM */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <Input 
            value={addressData.province} 
            onChange={(e) => handleInputChange('province', e.target.value)}
            placeholder="Province" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <Input 
            value={addressData.community} 
            onChange={(e) => handleInputChange('community', e.target.value)}
            placeholder="Communauté autonome" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <Input 
            value={addressData.utm} 
            onChange={(e) => handleInputChange('utm', e.target.value)}
            placeholder="UTM" 
            className="text-sm h-8" 
            readOnly={loadingCadastral}
          />
        </div>
      </div>

      {/* Ligne 3: Géolocalisation, Référence Cadastrale, cellule vide */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Input 
            value={addressData.coordinates} 
            onChange={(e) => handleInputChange('coordinates', e.target.value)}
            placeholder="Géolocalisation (lat, lng)" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <Input 
            value={addressData.cadastralReference} 
            onChange={(e) => handleInputChange('cadastralReference', e.target.value)}
            placeholder="Référence Cadastrale" 
            className="text-sm h-8"
            readOnly={loadingCadastral}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default AddressFormSection;
