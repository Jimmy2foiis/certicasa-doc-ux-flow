
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
    utm: string;
  };
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void;
  onAddressComponentsChange: (components: AddressComponents) => void;
  onInputChange: (field: string, value: string) => void;
  loadingCadastral?: boolean;
}

const AddressFormFields = ({
  addressData,
  onAddressChange,
  onCoordinatesChange,
  onAddressComponentsChange,
  onInputChange,
  loadingCadastral
}: AddressFormFieldsProps) => {
  return (
    <>
      {/* Ligne 1: Rue, Code postal, Ville */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rue</label>
          <AddressSearch
            initialAddress={addressData.street}
            onAddressChange={(address) => onInputChange('street', address)}
            onCoordinatesChange={onCoordinatesChange}
            onAddressComponentsChange={onAddressComponentsChange}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Code postal</label>
          <Input 
            value={addressData.postalCode} 
            onChange={(e) => onInputChange('postalCode', e.target.value)}
            placeholder="Code postal" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Ville</label>
          <Input 
            value={addressData.city} 
            onChange={(e) => onInputChange('city', e.target.value)}
            placeholder="Ville" 
            className="text-sm h-8" 
          />
        </div>
      </div>

      {/* Ligne 2: Province, Communauté autonome, UTM */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Province</label>
          <Input 
            value={addressData.province} 
            onChange={(e) => onInputChange('province', e.target.value)}
            placeholder="Province" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Communauté autonome</label>
          <Input 
            value={addressData.community} 
            onChange={(e) => onInputChange('community', e.target.value)}
            placeholder="Communauté autonome" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Coordonnées UTM 30</label>
          <Input 
            value={addressData.utm} 
            onChange={(e) => onInputChange('utm', e.target.value)}
            placeholder="UTM" 
            className="text-sm h-8" 
            readOnly={loadingCadastral}
          />
        </div>
      </div>
    </>
  );
};

export default AddressFormFields;
