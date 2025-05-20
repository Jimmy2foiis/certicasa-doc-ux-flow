
import { useState } from "react";
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
    <div className="space-y-6 lg:col-span-2">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <ClientBasicInfo client={client} />
            <ClientPersonalInfo client={client} />
            
            <AddressSearch 
              address={address || ''} 
              onAddressChange={onAddressChange} 
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientInfoCard;
