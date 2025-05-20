
import { User, Mail, Phone, Building, FileText, Calendar, MapPinned, FileSpreadsheet, MapPin, Navigation, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddressSearch from "./AddressSearch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <div className="flex items-center">
        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
          <User className="h-10 w-10" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium">{client.name}</h3>
          <Badge variant={client.status === "Activo" ? "success" : "outline"}>
            {client.status === "Activo" ? "Actif" : "Inactif"}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex">
          <Mail className="h-5 w-5 text-gray-500 mr-3" />
          <span>{client.email}</span>
        </div>
        <div className="flex">
          <Phone className="h-5 w-5 text-gray-500 mr-3" />
          <span>{client.phone}</span>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Adresse</p>
          <AddressSearch 
            initialAddress={address} 
            onAddressChange={onAddressChange} 
            onCoordinatesChange={onCoordinatesChange}
          />
        </div>
        
        {/* Section Informations Cadastrales avec bouton rafraîchir */}
        <CadastralInfo 
          utmCoordinates={utmCoordinates}
          cadastralReference={cadastralReference}
          climateZone={climateZone}
          loadingCadastral={loadingCadastral}
          apiSource={apiSource}
          onRefresh={onRefreshCadastralData}
        />
        
        <div className="flex">
          <Building className="h-5 w-5 text-gray-500 mr-3" />
          <span>NIF: {client.nif || "X-1234567-Z"}</span>
        </div>
        <div className="flex">
          <FileText className="h-5 w-5 text-gray-500 mr-3" />
          <span>Type: RES{client.type || "010"}</span>
        </div>
        <div className="flex">
          <Calendar className="h-5 w-5 text-gray-500 mr-3" />
          <span>Inscription: 14/04/2023</span>
        </div>
      </div>
    </div>
  );
};

// Cadastral Info subcomponent
const CadastralInfo = ({
  utmCoordinates,
  cadastralReference,
  climateZone,
  loadingCadastral,
  apiSource,
  onRefresh
}: {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  loadingCadastral: boolean;
  apiSource?: string;
  onRefresh?: () => void;
}) => {
  return (
    <div className="space-y-2 mt-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          Données Cadastrales
          {apiSource && (
            <Badge variant="outline" className="ml-2 text-xs">
              API {apiSource}
            </Badge>
          )}
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={onRefresh} 
                disabled={loadingCadastral || !onRefresh}
              >
                <RefreshCcw className={`h-4 w-4 ${loadingCadastral ? 'animate-spin' : ''}`} />
                <span className="sr-only">Actualiser les données cadastrales</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actualiser les données cadastrales</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex">
        <MapPinned className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">UTM30:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Chargement des coordonnées...</span>
          ) : utmCoordinates ? (
            <span className="text-xs font-mono">{utmCoordinates}</span>
          ) : (
            <span className="text-amber-600 text-sm">Non disponible</span>
          )}
        </div>
      </div>
      
      <div className="flex">
        <FileSpreadsheet className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">Référence cadastrale:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Chargement des données cadastrales...</span>
          ) : cadastralReference ? (
            <span className="font-mono">{cadastralReference}</span>
          ) : (
            <span className="text-amber-600 text-sm">Non disponible</span>
          )}
        </div>
      </div>
      
      <div className="flex">
        <MapPin className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">Zone climatique:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Chargement de la zone climatique...</span>
          ) : climateZone ? (
            <span>{climateZone}</span>
          ) : (
            <span className="text-amber-600 text-sm">Non disponible</span>
          )}
        </div>
      </div>
      
      {/* Géolocalisation */}
      <div className="flex">
        <Navigation className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">Géolocalisation:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Chargement des coordonnées GPS...</span>
          ) : utmCoordinates ? (
            <span className="text-xs font-mono">Lat/Long disponible dans l'API Google Maps</span>
          ) : (
            <span className="text-amber-600 text-sm">Non disponible</span>
          )}
        </div>
      </div>
      
      {!loadingCadastral && !cadastralReference && (
        <Alert variant="default" className="mt-2">
          <AlertDescription className="text-xs">
            Les données cadastrales n'ont pas pu être récupérées. Vérifiez que l'adresse est en Espagne et correctement formatée, ou que le service Catastro est accessible.
            {onRefresh && (
              <Button variant="link" size="sm" className="p-0 h-auto ml-1" onClick={onRefresh}>
                Réessayer
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ClientPersonalInfo;
