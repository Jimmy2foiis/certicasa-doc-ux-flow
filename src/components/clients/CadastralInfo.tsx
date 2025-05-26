
import { MapPinned, FileSpreadsheet, MapPin, Navigation, RefreshCcw, Globe, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useState } from "react";

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
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Déterminer le statut de l'API et le badge approprié
  const getApiStatusBadge = () => {
    if (!apiSource) return null;
    
    switch (apiSource) {
      case 'REST':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800"><Wifi className="h-3 w-3 mr-1" />API OK</Badge>;
      case 'PROXIMITY':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800"><Navigation className="h-3 w-3 mr-1" />Proximité</Badge>;
      case 'FALLBACK':
        return <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800"><WifiOff className="h-3 w-3 mr-1" />Mode hors ligne</Badge>;
      case 'PARTIAL':
        return <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Données partielles</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{apiSource}</Badge>;
    }
  };

  // Afficher un message d'information selon le statut
  const getStatusMessage = () => {
    if (!apiSource) return null;

    switch (apiSource) {
      case 'FALLBACK':
        return (
          <Alert variant="default" className="mt-2 bg-orange-50 border-orange-200">
            <WifiOff className="h-4 w-4" />
            <AlertTitle className="text-sm">Mode hors ligne activé</AlertTitle>
            <AlertDescription className="text-xs">
              L'API du Catastro espagnol n'est pas accessible. Les coordonnées UTM et la zone climatique ont été calculées approximativement.
            </AlertDescription>
          </Alert>
        );
      case 'PARTIAL':
        return (
          <Alert variant="default" className="mt-2 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm">Données partielles</AlertTitle>
            <AlertDescription className="text-xs">
              Certaines informations ont été obtenues du Catastro, d'autres ont été calculées approximativement.
            </AlertDescription>
          </Alert>
        );
      case 'PROXIMITY':
        return (
          <Alert variant="default" className="mt-2 bg-blue-50 border-blue-200">
            <Navigation className="h-4 w-4" />
            <AlertTitle className="text-sm">Recherche par proximité</AlertTitle>
            <AlertDescription className="text-xs">
              Référence cadastrale trouvée par recherche de proximité.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2 mt-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          Données Cadastrales
          {getApiStatusBadge()}
        </h3>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="sr-only">Informations de diagnostic</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Afficher/masquer les informations de diagnostic</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
          <p className="font-medium text-sm">Coordonnées UTM:</p>
          {loadingCadastral ? (
            <span className="text-gray-500">Calcul des coordonnées UTM...</span>
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
            <span className="text-amber-600 text-sm">Non disponible via API</span>
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
            <span className="font-semibold text-blue-700">{climateZone}</span>
          ) : (
            <span className="text-amber-600 text-sm">Non disponible</span>
          )}
        </div>
      </div>

      {/* Message de statut selon la source de données */}
      {getStatusMessage()}
      
      {/* Informations de debugging conditionnelles */}
      {showDebugInfo && (
        <Alert variant="default" className="mt-2 bg-gray-50 border-gray-200">
          <AlertTitle className="text-xs font-semibold">Informations de diagnostic</AlertTitle>
          <AlertDescription className="text-xs space-y-1">
            <p>
              API Source: <span className="font-mono">{apiSource || "Non spécifié"}</span>
            </p>
            <p>
              GPS: <span className="font-mono">{gpsCoordinates ? `${gpsCoordinates.lat.toFixed(6)}, ${gpsCoordinates.lng.toFixed(6)}` : "Non disponibles"}</span>
            </p>
            <p>
              UTM: <span className="font-mono">{utmCoordinates || "Non disponibles"}</span>
            </p>
            <p>
              Ref: <span className="font-mono">{cadastralReference || "Non disponible"}</span>
            </p>
            <p>
              Zone: <span className="font-mono">{climateZone || "Non disponible"}</span>
            </p>
            <p className="text-gray-500 italic">
              {apiSource === 'FALLBACK' ? 
                "Mode hors ligne : Les données UTM et zone climatique sont calculées localement." :
                "Consultez la console du navigateur pour plus d'informations de débogage."
              }
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CadastralInfo;
