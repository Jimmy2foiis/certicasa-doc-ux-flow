
import React from "react";
import { Input } from "@/components/ui/input";
import ClimateZoneDisplay from "@/components/clients/ClimateZoneDisplay";

interface CadastralFormFieldsProps {
  addressData: {
    utm: string;
    coordinates: string;
    cadastralReference: string;
  };
  climateZone: string;
  climateData: any;
  loadingCadastral: boolean;
  onInputChange: (field: string, value: string) => void;
  onClimateZoneChange: (zone: string) => void;
}

const CadastralFormFields = ({
  addressData,
  climateZone,
  climateData,
  loadingCadastral,
  onInputChange,
  onClimateZoneChange
}: CadastralFormFieldsProps) => {
  return (
    <>
      {/* Ligne 3: Géolocalisation, Référence Cadastrale, Zone Climatique */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Coordonnées GPS</label>
          <Input 
            value={addressData.coordinates} 
            onChange={(e) => onInputChange('coordinates', e.target.value)}
            placeholder="Géolocalisation (lat, lng)" 
            className="text-sm h-8" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Référence Cadastrale</label>
          <Input 
            value={addressData.cadastralReference} 
            onChange={(e) => onInputChange('cadastralReference', e.target.value)}
            placeholder="Référence Cadastrale" 
            className="text-sm h-8"
            readOnly={loadingCadastral}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Zone climatique</label>
          <div className="h-8">
            <ClimateZoneDisplay
              climateZone={climateZone}
              confidence={climateData?.confidence}
              method={climateData?.method}
              referenceCity={climateData?.referenceCity}
              distance={climateData?.distance}
              description={climateData?.description}
              onZoneChange={onClimateZoneChange}
              editable={true}
              compact={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CadastralFormFields;
