
import AddressSearch from "./AddressSearch";
import ClientAvatar from "./ClientAvatar";
import ClientBasicInfo from "./ClientBasicInfo";
import CadastralInfo from "./CadastralInfo";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface ClientPersonalInfoProps {
  client: any;
  address: string;
  onAddressChange: (newAddress: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  loadingCadastral: boolean;
  apiSource?: string;
  onRefreshCadastralData?: () => void;
}

const ClientPersonalInfo = ({
  client,
  address,
  onAddressChange,
  onCoordinatesChange,
  utmCoordinates,
  cadastralReference,
  climateZone,
  loadingCadastral,
  apiSource,
  onRefreshCadastralData
}: ClientPersonalInfoProps) => {
  return (
    <div className="space-y-6">
      <ClientAvatar name={client.name} status={client.status} />

      <div className="space-y-4">
        <ClientBasicInfo 
          email={client.email} 
          phone={client.phone} 
          nif={client.nif} 
          type={client.type}
        />
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Adresse</p>
          <AddressSearch 
            initialAddress={address} 
            onAddressChange={onAddressChange} 
            onCoordinatesChange={onCoordinatesChange}
          />
        </div>
        
        <CadastralInfo 
          utmCoordinates={utmCoordinates}
          cadastralReference={cadastralReference}
          climateZone={climateZone}
          loadingCadastral={loadingCadastral}
          apiSource={apiSource}
          onRefresh={onRefreshCadastralData}
        />
      </div>
    </div>
  );
};

export default ClientPersonalInfo;
