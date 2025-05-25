
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
  const [beforeLayers, setBeforeLayers] = useState<Layer[]>([]);
  const [afterLayers, setAfterLayers] = useState<Layer[]>([]);
  const { products } = useMaterialsAndProducts();

  // Initialiser les couches UNIQUEMENT si aucune donnée sauvegardée n'existe
  useEffect(() => {
    console.log('🔄 Initialisation des couches:', {
      savedBeforeLayers: savedBeforeLayers?.length || 0,
      savedAfterLayers: savedAfterLayers?.length || 0,
      floorType
    });

    // Si nous avons des données sauvegardées, les utiliser en priorité
    if (savedBeforeLayers && savedBeforeLayers.length > 0) {
      console.log('✅ Chargement des couches AVANT sauvegardées:', savedBeforeLayers);
      setBeforeLayers(savedBeforeLayers);
    } else {
      // Sinon, utiliser les valeurs par défaut ou le preset
      const preset = floorType ? getFloorTypePreset(floorType) : null;
      if (preset) {
        console.log('📋 Application du preset pour plancher:', floorType);
        setBeforeLayers(preset.beforeLayers.map(layer => ({ ...layer, id: `${layer.id}_${Date.now()}` })));
      } else {
        console.log('📋 Application des couches par défaut AVANT');
        setBeforeLayers([...initialLayers]);
      }
    }

    if (savedAfterLayers && savedAfterLayers.length > 0) {
      console.log('✅ Chargement des couches APRÈS sauvegardées:', savedAfterLayers);
      setAfterLayers(savedAfterLayers);
    } else {
      // Sinon, utiliser les valeurs par défaut ou le preset
      const preset = floorType ? getFloorTypePreset(floorType) : null;
      if (preset) {
        console.log('📋 Application du preset pour plancher APRÈS:', floorType);
        setAfterLayers(preset.afterLayers.map(layer => ({ ...layer, id: `${layer.id}_${Date.now()}` })));
      } else if (savedBeforeLayers && savedBeforeLayers.length > 0) {
        // Copier les couches avant si elles existent
        console.log('📋 Copie des couches AVANT vers APRÈS');
        setAfterLayers([...savedBeforeLayers]);
      } else {
        console.log('📋 Application des couches par défaut APRÈS');
        setAfterLayers([...initialLayers]);
      }
    }
  }, [savedBeforeLayers, savedAfterLayers, floorType]);

  const addLayer = (layerSet: "before" | "after", material: Material) => {
    const newLayer = {
      ...material,
      id: Date.now().toString(),
      isNew: true,
    };

    if (layerSet === "before") {
      setBeforeLayers([...beforeLayers, newLayer]);
    } else {
      setAfterLayers([...afterLayers, newLayer]);
    }
  };

  const addSouflr47 = () => {
    // Chercher le produit URSA SOUFL'R 47 dans la base de données
    const souflr47Product = products.find(p => p.id === 'URSA_SOUFLR_47' && p.isActive);
    
    if (souflr47Product) {
      const newSouflr: Layer = {
        id: Date.now().toString(),
        name: souflr47Product.name,
        thickness: souflr47Product.defaultThickness || 335,
        lambda: souflr47Product.lambda,
        r: souflr47Product.defaultR || 7.00,
        isNew: true,
      };
      setAfterLayers([...afterLayers, newSouflr]);
    } else {
      // Fallback au matériau par défaut si le produit n'est pas trouvé
      const fallbackSouflr: Layer = {
        id: Date.now().toString(),
        name: "SOUFL'R 47",
        thickness: 259,
        lambda: 0.047,
        r: 5.51,
        isNew: true,
      };
      setAfterLayers([...afterLayers, fallbackSouflr]);
    }
  };

  const copyBeforeToAfter = () => {
    console.log('📋 Copie des couches AVANT vers APRÈS');
    setAfterLayers([...beforeLayers]);
  };

  const updateLayer = (layerSet: "before" | "after", updatedLayer: Layer) => {
    console.log(`✅ Mise à jour couche ${layerSet}:`, {
      id: updatedLayer.id,
      name: updatedLayer.name,
      thickness: updatedLayer.thickness,
      lambda: updatedLayer.lambda,
      r: updatedLayer.r
    });
    
    if (layerSet === "before") {
      setBeforeLayers(prev => 
        prev.map((layer) => 
          layer.id === updatedLayer.id ? { ...updatedLayer } : layer
        )
      );
    } else {
      setAfterLayers(prev => 
        prev.map((layer) => 
          layer.id === updatedLayer.id ? { ...updatedLayer } : layer
        )
      );
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
