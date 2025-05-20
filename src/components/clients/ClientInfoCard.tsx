
import { Card, CardContent } from "@/components/ui/card";
import AddressSearch from "./AddressSearch";
import CadastralInfo from "./CadastralInfo";
import ClientPersonalInfo from "./ClientPersonalInfo";
import ClientBasicInfo from "./ClientBasicInfo";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface ClientInfoCardProps {
  client: any;
  address?: string;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  loadingCadastral: boolean;
  gpsCoordinates?: GeoCoordinates;
  onAddressChange?: (address: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
  onRefreshCadastralData?: () => Promise<void>;
}

const ClientInfoCard = ({
  client,
  address,
  utmCoordinates,
  cadastralReference,
  climateZone,
  apiSource,
  loadingCadastral,
  gpsCoordinates,
  onAddressChange,
  onCoordinatesChange,
  onRefreshCadastralData
}: ClientInfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <ClientBasicInfo 
            email={client?.email || ''}
            phone={client?.phone || ''}
            nif={client?.nif || ''}
            type={client?.type || ''}
          />
          
          <div className="space-y-4">
            <AddressSearch 
              initialAddress={address || ''} 
              onAddressChange={onAddressChange || (() => {})} 
              onCoordinatesChange={onCoordinatesChange}
            />
            
            <CadastralInfo 
              utmCoordinates={utmCoordinates}
              cadastralReference={cadastralReference}
              climateZone={climateZone}
              apiSource={apiSource}
              loadingCadastral={loadingCadastral}
              gpsCoordinates={gpsCoordinates}
              onRefresh={onRefreshCadastralData}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoCard;
