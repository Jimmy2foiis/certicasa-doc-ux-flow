
import { Layer } from "@/hooks/useLayerManagement";

interface ProjectCalculationHandlersProps {
  beforeLayers: Layer[];
  afterLayers: Layer[];
  setBeforeLayers: (layers: Layer[]) => void;
  setAfterLayers: (layers: Layer[]) => void;
  addLayer: (type: "before" | "after", material: any) => void;
  addSouflr47: () => void;
  updateLayer: (layerSet: "before" | "after", updatedLayer: Layer) => void;
  copyBeforeToAfter: () => void;
  setClimateZone: (zone: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

export const useProjectCalculationHandlers = ({
  beforeLayers,
  afterLayers,
  setBeforeLayers,
  setAfterLayers,
  addLayer,
  addSouflr47,
  updateLayer,
  copyBeforeToAfter,
  setClimateZone,
  onClimateZoneChange
}: ProjectCalculationHandlersProps) => {
  const handleDeleteBeforeLayer = (id: string) => {
    setBeforeLayers(beforeLayers.filter(l => l.id !== id));
  };

  const handleDeleteAfterLayer = (id: string) => {
    setAfterLayers(afterLayers.filter(l => l.id !== id));
  };

  // Gestionnaire de changement de zone climatique unifié et correct
  const handleClimateZoneChange = (zone: string) => {
    console.log('🔄 Changement de zone climatique dans le calcul:', zone);
    
    // Mettre à jour immédiatement la zone climatique dans le state de calcul
    setClimateZone(zone);
    
    // Propager le changement vers le parent (ClientTabsContainer)
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  const handleAddLayer = (type: "before" | "after") => {
    const defaultMaterial = { 
      id: Date.now().toString(), 
      name: "Sélectionnez un matériau", 
      thickness: 10, 
      lambda: 0.5, 
      r: 0.02 
    };
    addLayer(type, defaultMaterial);
  };

  // Simplifier la mise à jour des couches - utiliser directement updateLayer
  const handleUpdateLayer = (id: string, field: string, updatedLayer: any) => {
    console.log(`🔧 Mise à jour couche ID ${id}:`, updatedLayer);
    
    // Déterminer si c'est une couche "before" ou "after"
    const isBeforeLayer = beforeLayers.some(l => l.id === id);
    const isAfterLayer = afterLayers.some(l => l.id === id);
    
    if (isBeforeLayer) {
      updateLayer("before", updatedLayer);
    } else if (isAfterLayer) {
      updateLayer("after", updatedLayer);
    }
  };

  const handleAddSouflr47 = () => {
    addSouflr47();
  };

  return {
    handleDeleteBeforeLayer,
    handleDeleteAfterLayer,
    handleClimateZoneChange,
    handleAddLayer,
    handleUpdateLayer,
    handleAddSouflr47
  };
};
