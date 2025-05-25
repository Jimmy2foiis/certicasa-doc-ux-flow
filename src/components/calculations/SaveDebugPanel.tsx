
import { Button } from "@/components/ui/button";
import { Save, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCalculationPersistence } from "@/hooks/useCalculationPersistence";

interface SaveDebugPanelProps {
  clientId: string;
  onSave?: () => void;
  calculationData?: any;
}

const SaveDebugPanel = ({ clientId, onSave, calculationData }: SaveDebugPanelProps) => {
  const { toast } = useToast();
  const { clearCalculationState, hasPersistedData, getCalculationState } = useCalculationPersistence(clientId);

  const handleClearCache = () => {
    const success = clearCalculationState();
    if (success) {
      toast({
        title: "🗑️ Cache effacé",
        description: "Toutes les données sauvegardées ont été supprimées",
        duration: 3000,
      });
      // Forcer un rechargement de la page pour voir l'effet
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
    const data = getCalculationState();
    console.log('📊 Données actuellement sauvegardées:', data);
    
    if (data) {
      toast({
        title: "📊 Données trouvées dans le cache",
        description: `${data.beforeLayers?.length || 0} + ${data.afterLayers?.length || 0} couches sauvegardées`,
        duration: 3000,
      });
    } else {
      toast({
        title: "📭 Aucune donnée en cache",
        description: "Aucune sauvegarde trouvée",
        duration: 3000,
      });
    }
  };

  const handleManualSave = () => {
    if (onSave) {
      onSave();
    } else {
      toast({
        title: "⚠️ Fonction de sauvegarde manuelle non disponible",
        description: "Utilisez l'auto-sauvegarde ou le bouton principal",
        variant: "destructive",
      });
    }
  };

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
        onClick={handleClearCache} 
        variant="outline" 
        size="sm"
        className="text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Vider Cache
      </Button>
      
      <div className="flex items-center text-xs text-gray-500 ml-2">
        Cache: {hasPersistedData() ? '✅ Données trouvées' : '❌ Vide'}
      </div>
    </div>
  );
};

export default SaveDebugPanel;
