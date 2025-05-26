
import React from "react";
import { MapPin } from "lucide-react";
import AddressFormFields from "./components/AddressFormFields";
import CadastralFormFields from "./components/CadastralFormFields";
import { useAddressFormLogic } from "./hooks/useAddressFormLogic";

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
  const {
    addressData,
    climateZone,
    climateData,
    loadingCadastral,
    handleAddressSelected,
    handleCoordinatesSelected,
    handleAddressComponentsSelected,
    handleClimateZoneChange,
    handleInputChange
  } = useAddressFormLogic({ client, onClimateZoneChange });

  return (
    <div className="border-b pb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Adresse complète
      </h3>
      
      <AddressFormFields
        addressData={{
          street: addressData.street,
          postalCode: addressData.postalCode,
          city: addressData.city,
          province: addressData.province,
          community: addressData.community,
          utm: addressData.utm
        }}
        onAddressChange={handleAddressSelected}
        onCoordinatesChange={handleCoordinatesSelected}
        onAddressComponentsChange={handleAddressComponentsSelected}
        onInputChange={handleInputChange}
        loadingCadastral={loadingCadastral}
      />

      <CadastralFormFields
        addressData={{
          utm: addressData.utm,
          coordinates: addressData.coordinates,
          cadastralReference: addressData.cadastralReference
        }}
        climateZone={climateZone}
        climateData={climateData}
        loadingCadastral={loadingCadastral}
        onInputChange={handleInputChange}
        onClimateZoneChange={handleClimateZoneChange}
      />
    </div>
  );
};

export default AddressFormSection;
