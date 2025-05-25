
import { Button } from "@/components/ui/button";
import { Save, Trash2, RefreshCw, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculationPersistenceService } from "@/services/calculationPersistenceService";

interface SaveDebugPanelProps {
  clientId: string;
  onSave?: () => void;
  calculationData?: any;
}

const SaveDebugPanel = ({ clientId, onSave, calculationData }: SaveDebugPanelProps) => {
  const { toast } = useToast();

  const handleClearCache = () => {
    const success = calculationPersistenceService.clearCalculationState(clientId);
    if (success) {
      toast({
        title: "🗑️ Cache effacé",
        description: "Toutes les données sauvegardées ont été supprimées",
        duration: 3000,
      });
      // Forcer un rechargement pour voir l'effet
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast({
        title: "❌ Erreur",
        description: "Impossible d'effacer le cache",
        variant: "destructive",
      });
    }
  };

  const handleShowSavedData = () => {
    const data = calculationPersistenceService.getCalculationState(clientId);
    console.log('📊 Données sauvegardées (service isolé):', data);
    
    if (data) {
      toast({
        title: "📊 Données trouvées",
        description: `${data.beforeLayers?.length || 0} + ${data.afterLayers?.length || 0} couches • Session: ${data.sessionId?.slice(-8) || 'N/A'}`,
        duration: 3000,
      });
    } else {
      toast({
        title: "📭 Aucune donnée",
        description: "Aucune sauvegarde trouvée pour ce client",
        duration: 3000,
      });
    }
  };

  const handleManualSave = () => {
    if (onSave) {
      onSave();
      toast({
        title: "💾 Sauvegarde manuelle",
        description: "Sauvegarde forcée déclenchée",
        duration: 2000,
      });
    } else {
      toast({
        title: "⚠️ Fonction indisponible",
        description: "Utilisez l'auto-sauvegarde",
        variant: "destructive",
      });
    }
  };

  const handleMarkForSync = () => {
    if (calculationData) {
      calculationPersistenceService.markForDatabaseSync(clientId, calculationData);
      toast({
        title: "📋 Marqué pour sync BDD",
        description: "Ces calculs seront synchronisés avec la base de données future",
        duration: 3000,
      });
    }
  };

  const hasData = calculationPersistenceService.hasPersistedData(clientId);

  return (
    <div className="flex gap-2 p-3 bg-gray-50 border rounded-lg">
      <Button 
        onClick={handleManualSave} 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700"
        disabled={!onSave}
      >
        <Save className="h-4 w-4 mr-1" />
        Sauvegarder
      </Button>
      
      <Button 
        onClick={handleShowSavedData} 
        variant="outline" 
        size="sm"
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Vérifier Cache
      </Button>
      
      <Button 
        onClick={handleMarkForSync} 
        variant="outline" 
        size="sm"
        className="text-green-600 hover:bg-green-50"
        disabled={!calculationData}
      >
        <Database className="h-4 w-4 mr-1" />
        Marquer Sync BDD
      </Button>
      
      <Button 
        onClick={handleClearCache} 
        variant="outline" 
        size="sm"
        className="text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Vider Cache
      </Button>
      
      <div className="flex items-center text-xs text-gray-500 ml-2">
        Service Isolé: {hasData ? '✅ Données' : '❌ Vide'} • Auto-save: 3s
      </div>
    </div>
  );
};

export default SaveDebugPanel;
