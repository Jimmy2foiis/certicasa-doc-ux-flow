import { MapPinned, FileSpreadsheet, MapPin, Navigation, RefreshCcw, Globe, AlertCircle } from "lucide-react";
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
  
  // Fonction pour obtenir le badge de statut API approprié
  const getApiStatusBadge = (source?: string) => {
    if (!source) return null;
    
    const badgeProps = {
      'REST': { variant: 'default' as const, label: 'REST', color: 'text-green-600' },
      'SOAP': { variant: 'secondary' as const, label: 'SOAP', color: 'text-blue-600' },
      'REST+SOAP_FAILED': { variant: 'destructive' as const, label: 'API FAILED', color: 'text-red-600' },
      'FALLBACK': { variant: 'outline' as const, label: 'FALLBACK', color: 'text-orange-600' }
    };
    
    const config = badgeProps[source as keyof typeof badgeProps] || 
                   { variant: 'outline' as const, label: source, color: 'text-gray-600' };
    
    return (
      <Badge variant={config.variant} className="ml-2 text-xs">
        {config.label}
      </Badge>
    );
  };
  
  // Fonction pour ajuster légèrement les coordonnées GPS (pour contourner les problèmes de frontière de parcelle)
  const handleAdjustCoordinates = () => {
    if (!gpsCoordinates || !onRefresh) return;
    
    // Créer un petit offset aléatoire (entre -0.00001 et 0.00001, soit environ 1m)
    const latOffset = (Math.random() - 0.5) * 0.00002;
    const lngOffset = (Math.random() - 0.5) * 0.00002;
    
    // Appliquer l'offset aux coordonnées actuelles
    const adjustedCoordinates = {
      lat: gpsCoordinates.lat + latOffset,
      lng: gpsCoordinates.lng + lngOffset
    };
    
    console.log("Coordonnées ajustées:", adjustedCoordinates);
    
    // Simuler un clic sur un point légèrement différent
    if (typeof onRefresh === 'function') {
      // onRefresh devrait être mis à jour pour accepter des coordonnées en paramètre
      // Pour le moment, on utilise juste le rafraîchissement normal
      onRefresh();
    }
  };

  return (
    <div className="space-y-2 mt-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          Données Cadastrales
          {getApiStatusBadge(apiSource)}
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
      
      {/* API Status Information */}
      {apiSource && (
        <Alert variant="default" className="mt-2 bg-blue-50 border-blue-200">
          <AlertDescription className="text-xs">
            <strong>Méthode API utilisée :</strong>
            {apiSource === 'REST' && ' API REST (rapide, format JSON)'}
            {apiSource === 'SOAP' && ' API SOAP (fallback, format XML)'}
            {apiSource === 'REST+SOAP_FAILED' && ' Échec des deux APIs (REST et SOAP)'}
            {apiSource === 'FALLBACK' && ' Calcul local approximatif'}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Afficher des informations supplémentaires si pas de référence cadastrale */}
      {!loadingCadastral && !cadastralReference && gpsCoordinates && (
        <Alert variant={utmCoordinates ? "default" : "destructive"} className="mt-2">
          <AlertDescription className="text-xs space-y-1">
            <p>
              {utmCoordinates ? 
                "Coordonnées GPS obtenues mais le Catastro n'a pas trouvé de référence cadastrale. Le bien pourrait ne pas être enregistré ou être hors du territoire espagnol." :
                "Impossible d'obtenir les coordonnées GPS. Vérifiez que l'adresse est complète et en Espagne."
              }
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {onRefresh && (
                <Button variant="outline" size="sm" className="h-6 text-xs" onClick={onRefresh}>
                  <RefreshCcw className="h-3 w-3 mr-1" /> Réessayer
                </Button>
              )}
              
              {gpsCoordinates && onRefresh && (
                <Button variant="outline" size="sm" className="h-6 text-xs" onClick={handleAdjustCoordinates}>
                  <MapPin className="h-3 w-3 mr-1" /> Ajuster le point GPS
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Informations de debugging conditionnelles */}
      {showDebugInfo && (
        <Alert variant="default" className="mt-2 bg-gray-50 border-gray-200">
          <AlertTitle className="text-xs font-semibold">Informations de diagnostic</AlertTitle>
          <AlertDescription className="text-xs space-y-1">
            <p>
              API: <span className="font-mono">{apiSource || "Non spécifié"}</span>
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
            <p className="text-gray-500 italic">Consultez la console du navigateur pour plus d'informations de débogage.</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CadastralInfo;
