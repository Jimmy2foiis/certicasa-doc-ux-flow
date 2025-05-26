
import { useState, useEffect } from "react";
import { Material } from "@/data/materials";
import { getFloorTypePreset } from "@/utils/floorTypePresets";
import { useMaterialsAndProducts } from "./useMaterialsAndProducts";

export interface Layer extends Material {
  isNew?: boolean;
}

const initialLayers: Layer[] = [
  { id: "1", name: "Enduit de plâtre", thickness: 15, lambda: 0.3, r: 0.05 },
  { id: "2", name: "Brique céramique", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "3", name: "Lame d'air", thickness: 50, lambda: "-", r: 0.18 },
  { id: "4", name: "Brique céramique", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "5", name: "Enduit de plâtre", thickness: 15, lambda: 0.3, r: 0.05 },
];

interface UseLayerManagementProps {
  savedBeforeLayers?: Layer[];
  savedAfterLayers?: Layer[];
  floorType?: string;
}

export const useLayerManagement = ({ savedBeforeLayers, savedAfterLayers, floorType }: UseLayerManagementProps) => {
  const [beforeLayers, setBeforeLayers] = useState<Layer[]>(initialLayers);
  const [afterLayers, setAfterLayers] = useState<Layer[]>([...initialLayers]);
  const [lastFloorType, setLastFloorType] = useState<string | undefined>(floorType);
  const { products } = useMaterialsAndProducts();

  // Gérer les données sauvegardées
  useEffect(() => {
    if (savedBeforeLayers && savedBeforeLayers.length > 0) {
      console.log('🔄 Chargement couches AVANT sauvegardées:', savedBeforeLayers);
      setBeforeLayers(savedBeforeLayers);
    }
    if (savedAfterLayers && savedAfterLayers.length > 0) {
      console.log('🔄 Chargement couches APRÈS sauvegardées:', savedAfterLayers);
      setAfterLayers(savedAfterLayers);
    } else if (savedBeforeLayers && savedBeforeLayers.length > 0) {
      setAfterLayers([...savedBeforeLayers]);
    }
  }, [savedBeforeLayers, savedAfterLayers]);

  // Gérer les changements de type de plancher
  useEffect(() => {
    if (floorType && floorType !== lastFloorType) {
      console.log('🏗️ Type de plancher changé:', lastFloorType, '->', floorType);
      
      // Ne pas pré-remplir si on a déjà des données sauvegardées
      if (!savedBeforeLayers || savedBeforeLayers.length === 0) {
        const preset = getFloorTypePreset(floorType);
        if (preset) {
          console.log(`✅ Pré-remplissage automatique pour plancher: ${floorType}`, preset);
          const timestamp = Date.now();
          
          const newBeforeLayers = preset.beforeLayers.map((layer, index) => ({ 
            ...layer, 
            id: `${layer.id}_${timestamp}_${index}` 
          }));
          
          const newAfterLayers = preset.afterLayers.map((layer, index) => ({ 
            ...layer, 
            id: `${layer.id}_${timestamp}_${index}` 
          }));
          
          setBeforeLayers(newBeforeLayers);
          setAfterLayers(newAfterLayers);
        }
      }
      
      setLastFloorType(floorType);
    }
  }, [floorType, lastFloorType, savedBeforeLayers]);

  const addLayer = (layerSet: "before" | "after", material: Material) => {
    const newLayer = {
      ...material,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isNew: true,
    };

    console.log('➕ Ajout couche:', layerSet, newLayer);

    if (layerSet === "before") {
      setBeforeLayers(prev => {
        const newLayers = [...prev, newLayer];
        console.log('📊 Nouvelles couches AVANT après ajout:', newLayers.length);
        return newLayers;
      });
    } else {
      setAfterLayers(prev => {
        const newLayers = [...prev, newLayer];
        console.log('📊 Nouvelles couches APRÈS après ajout:', newLayers.length);
        return newLayers;
      });
    }
  };

  const addSouflr47 = () => {
    // Chercher le produit URSA SOUFL'R 47 dans la base de données
    const souflr47Product = products.find(p => p.id === 'URSA_SOUFLR_47' && p.isActive);
    
    if (souflr47Product) {
      const newSouflr: Layer = {
        id: `souflr47_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: souflr47Product.name,
        thickness: souflr47Product.defaultThickness || 335,
        lambda: souflr47Product.lambda,
        r: souflr47Product.defaultR || 7.00,
        isNew: true,
      };
      console.log('➕ Ajout SOUFL\'R 47:', newSouflr);
      setAfterLayers(prev => {
        const newLayers = [...prev, newSouflr];
        console.log('📊 Nouvelles couches APRÈS après ajout SOUFL\'R 47:', newLayers.length);
        return newLayers;
      });
    } else {
      // Fallback au matériau par défaut si le produit n'est pas trouvé
      const fallbackSouflr: Layer = {
        id: `souflr47_fallback_${Date.now()}`,
        name: "SOUFL'R 47",
        thickness: 259,
        lambda: 0.047,
        r: 5.51,
        isNew: true,
      };
      console.log('➕ Ajout SOUFL\'R 47 (fallback):', fallbackSouflr);
      setAfterLayers(prev => {
        const newLayers = [...prev, fallbackSouflr];
        console.log('📊 Nouvelles couches APRÈS après ajout SOUFL\'R 47 (fallback):', newLayers.length);
        return newLayers;
      });
    }
  };

  const copyBeforeToAfter = () => {
    console.log('📋 Copie couches AVANT vers APRÈS - forcer recalcul COMPLET');
    
    // Créer une copie complètement nouvelle avec des IDs uniques
    const copiedLayers = beforeLayers.map(layer => ({ 
      ...layer, 
      id: `${layer.id}_copied_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
    }));
    
    setAfterLayers([...copiedLayers]);
    
    // Forcer également la mise à jour des couches AVANT pour débloquer les calculs
    setBeforeLayers(prev => [...prev]);
    
    console.log('📊 Couches copiées et recalculs forcés:', copiedLayers.length, 'couches');
    console.log('🔄 Forçage recalcul section AVANT également');
  };

  const updateLayer = (layerSet: "before" | "after", updatedLayer: Layer) => {
    console.log(`✏️ Mise à jour couche ${layerSet} - FORCER RECALCUL:`, updatedLayer);
    
    if (layerSet === "before") {
      setBeforeLayers(prev => {
        const newLayers = prev.map((layer) => 
          layer.id === updatedLayer.id ? { ...updatedLayer } : layer
        );
        console.log('📊 Couches AVANT mises à jour - FORCE RECALCUL:', newLayers.length);
        // Retourner un nouveau tableau pour forcer le recalcul
        return [...newLayers];
      });
    } else {
      setAfterLayers(prev => {
        const newLayers = prev.map((layer) => 
          layer.id === updatedLayer.id ? { ...updatedLayer } : layer
        );
        console.log('📊 Couches APRÈS mises à jour - FORCE RECALCUL:', newLayers.length);
        // Retourner un nouveau tableau pour forcer le recalcul
        return [...newLayers];
      });
    }
  };

  return {
    beforeLayers,
    setBeforeLayers,
    afterLayers,
    setAfterLayers,
    addLayer,
    addSouflr47,
    copyBeforeToAfter,
    updateLayer,
  };
};
