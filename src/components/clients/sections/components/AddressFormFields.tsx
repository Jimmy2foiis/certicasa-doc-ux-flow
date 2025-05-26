
import React from "react";
import { Input } from "@/components/ui/input";
import AddressSearch from "@/components/clients/AddressSearch";
import { AddressComponents } from "@/types/googleMaps";

interface AddressFormFieldsProps {
  addressData: {
    street: string;
    postalCode: string;
    city: string;
    province: string;
    community: string;
  };
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void;
  onAddressComponentsChange: (components: AddressComponents) => void;
  onInputChange: (field: string, value: string) => void;
}

const AddressFormFields = ({
  addressData,
  onAddressChange,
  onCoordinatesChange,
  onAddressComponentsChange,
  onInputChange
}: AddressFormFieldsProps) => {
  return (
    <>
      {/* Ligne 1: Rue, Code postal, Ville */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <AddressSearch
            initialAddress={addressData.street}
            onAddressChange={(address) => onInputChange('street', address)}
            onCoordinatesChange={onCoordinatesChange}
            onAddressComponentsChange={onAddressComponentsChange}
          />
        </div>
        <div>
          <Input 
            value={addressData.postalCode} 
            onChange={(e) => onInputChange('postalCode', e.target.value)}
            placeholder="Code postal" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <Input 
            value={addressData.city} 
            onChange={(e) => onInputChange('city', e.target.value)}
            placeholder="Ville" 
            className="text-sm h-8" 
          />
        </div>
      </div>

      {/* Ligne 2: Province, Communauté autonome */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <Input 
            value={addressData.province} 
            onChange={(e) => onInputChange('province', e.target.value)}
            placeholder="Province" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <Input 
            value={addressData.community} 
            onChange={(e) => onInputChange('community', e.target.value)}
            placeholder="Communauté autonome" 
            className="text-sm h-8" 
          />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default AddressFormFields;
