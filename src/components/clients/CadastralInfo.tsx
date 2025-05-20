
import { MapPinned, FileSpreadsheet, MapPin, Navigation, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CadastralInfoProps {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  loadingCadastral: boolean;
  apiSource?: string;
  onRefresh?: () => void;
}

const CadastralInfo = ({
  utmCoordinates,
  cadastralReference,
  climateZone,
  loadingCadastral,
  apiSource,
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

export default CadastralInfo;
