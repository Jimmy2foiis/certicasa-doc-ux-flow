
import { MapPinned, FileSpreadsheet, MapPin, Navigation, RefreshCcw, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface CadastralInfoProps {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  loadingCadastral: boolean;
  apiSource?: string;
  gpsCoordinates?: { lat: number; lng: number };
  onRefresh?: () => void;
}

const CadastralInfo = ({
  utmCoordinates,
  cadastralReference,
  climateZone,
  loadingCadastral,
  apiSource,
  gpsCoordinates,
  onRefresh
}: CadastralInfoProps) => {
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
      
      {gpsCoordinates && (
        <div className="flex">
          <Globe className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Coordonnées GPS:</p>
            <span className="text-xs font-mono">
              Lat: {gpsCoordinates.lat.toFixed(6)}, Lng: {gpsCoordinates.lng.toFixed(6)}
            </span>
          </div>
        </div>
      )}
      
      <div className="flex">
        <Navigation className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">Géolocalisation:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Obtention des coordonnées GPS...</span>
          ) : utmCoordinates ? (
            <span className="text-xs text-green-600">Localisé avec précision GPS</span>
          ) : (
            <span className="text-amber-600 text-sm">Coordonnées non disponibles</span>
          )}
        </div>
      </div>
      
      <div className="flex">
        <MapPinned className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">UTM30:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Conversion des coordonnées...</span>
          ) : utmCoordinates ? (
            <span className="text-xs font-mono">{utmCoordinates}</span>
          ) : (
            <span className="text-amber-600 text-sm">Non disponible</span>
          )}
        </div>
      </div>
      
      <div className="flex">
        <FileSpreadsheet className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
        <div className="w-full">
          <p className="font-medium text-sm">Référence cadastrale:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Récupération depuis le Catastro...</span>
          ) : cadastralReference ? (
            <span className="font-mono text-green-700 font-semibold">{cadastralReference}</span>
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
            <span className="text-gray-500">Détermination de la zone climatique...</span>
          ) : climateZone ? (
            <span>{climateZone}</span>
          ) : (
            <span className="text-amber-600 text-sm">Non disponible</span>
          )}
        </div>
      </div>
      
      {!loadingCadastral && !cadastralReference && gpsCoordinates && (
        <Alert variant="default" className="mt-2">
          <AlertDescription className="text-xs">
            {utmCoordinates ? 
              "Coordonnées GPS obtenues mais le Catastro n'a pas trouvé de référence cadastrale. Le bien pourrait ne pas être enregistré ou être hors du territoire espagnol." :
              "Impossible d'obtenir les coordonnées GPS. Vérifiez que l'adresse est complète et en Espagne."
            }
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

export default CadastralInfo;
