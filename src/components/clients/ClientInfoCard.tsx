
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ClientPersonalInfo from "./ClientPersonalInfo";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface ClientInfoCardProps {
  client: any;
  address: string;
  onAddressChange: (newAddress: string) => void;
  onCoordinatesChange: (coordinates: GeoCoordinates) => void;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  loadingCadastral: boolean;
  apiSource?: string;
  onRefreshCadastralData?: () => void;
}

const ClientInfoCard = ({
  client,
  address,
  onAddressChange,
  onCoordinatesChange,
  utmCoordinates,
  cadastralReference,
  climateZone,
  apiSource,
  loadingCadastral,
  onRefreshCadastralData
}: ClientInfoCardProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Informations Personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientPersonalInfo 
          client={client} 
          address={address}
          onAddressChange={onAddressChange}
          onCoordinatesChange={onCoordinatesChange}
          utmCoordinates={utmCoordinates}
          cadastralReference={cadastralReference}
          climateZone={climateZone}
          apiSource={apiSource}
          loadingCadastral={loadingCadastral}
          onRefreshCadastralData={onRefreshCadastralData}
        />
      </CardContent>
    </Card>
  );
};

export default ClientInfoCard;
