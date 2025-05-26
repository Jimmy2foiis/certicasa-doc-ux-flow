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
    const newBeforeLayers = beforeLayers.filter(l => l.id !== id);
    setBeforeLayers([...newBeforeLayers]); // Force nouveau tableau
    console.log('🗑️ Suppression couche AVANT - FORCE RECALCUL:', id, '-> Nouvelles couches:', newBeforeLayers.length);
  };

  const handleDeleteAfterLayer = (id: string) => {
    const newAfterLayers = afterLayers.filter(l => l.id !== id);
    setAfterLayers([...newAfterLayers]); // Force nouveau tableau
    console.log('🗑️ Suppression couche APRÈS - FORCE RECALCUL:', id, '-> Nouvelles couches:', newAfterLayers.length);
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

  // Améliorer la mise à jour des couches pour forcer le recalcul OBLIGATOIREMENT
  const handleUpdateLayer = (id: string, field: string, updatedLayer: any) => {
    console.log(`🔧 Mise à jour couche ID ${id} - FORCE RECALCUL ABSOLU:`, updatedLayer);
    
    // Déterminer si c'est une couche "before" ou "after"
    const isBeforeLayer = beforeLayers.some(l => l.id === id);
    const isAfterLayer = afterLayers.some(l => l.id === id);
    
    if (isBeforeLayer) {
      console.log('📊 Mise à jour couche AVANT - FORCE RECALCUL TOTAL');
      
      // Mettre à jour via useLayerManagement
      updateLayer("before", updatedLayer);
      
      // FORCER ABSOLUMENT la mise à jour en créant un nouveau tableau avec timestamp
      const timestamp = Date.now();
      const updatedBeforeLayers = beforeLayers.map(layer => 
        layer.id === id ? { ...updatedLayer, _updateId: timestamp } : { ...layer, _updateId: timestamp }
      );
      setBeforeLayers([...updatedBeforeLayers]);
      
    } else if (isAfterLayer) {
      console.log('📊 Mise à jour couche APRÈS - FORCE RECALCUL TOTAL');
      
      // Mettre à jour via useLayerManagement
      updateLayer("after", updatedLayer);
      
      // FORCER ABSOLUMENT la mise à jour en créant un nouveau tableau avec timestamp
      const timestamp = Date.now();
      const updatedAfterLayers = afterLayers.map(layer => 
        layer.id === id ? { ...updatedLayer, _updateId: timestamp } : { ...layer, _updateId: timestamp }
      );
      setAfterLayers([...updatedAfterLayers]);
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
