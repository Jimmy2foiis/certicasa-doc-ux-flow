
import { useState, useEffect } from "react";
import { Material } from "@/data/materials";

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

const souflr47Material: Layer = {
  id: "souflr47",
  name: "SOUFL'R 47",
  thickness: 259,
  lambda: 0.047,
  r: 5.51,
  isNew: true,
};

interface UseLayerManagementProps {
  savedBeforeLayers?: Layer[];
  savedAfterLayers?: Layer[];
}

export const useLayerManagement = ({ savedBeforeLayers, savedAfterLayers }: UseLayerManagementProps) => {
  const [beforeLayers, setBeforeLayers] = useState<Layer[]>(initialLayers);
  const [afterLayers, setAfterLayers] = useState<Layer[]>([...initialLayers]);

  useEffect(() => {
    if (savedBeforeLayers) setBeforeLayers(savedBeforeLayers);
    if (savedAfterLayers) setAfterLayers(savedAfterLayers);
    else if (!savedBeforeLayers) setAfterLayers([...beforeLayers]);
  }, [savedBeforeLayers, savedAfterLayers]);

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
    const newSouflr = {
      ...souflr47Material,
      id: Date.now().toString(),
    };
    setAfterLayers([...afterLayers, newSouflr]);
  };

  const copyBeforeToAfter = () => {
    setAfterLayers([...beforeLayers]);
  };

  const updateLayer = (layerSet: "before" | "after", updatedLayer: Layer) => {
    if (layerSet === "before") {
      setBeforeLayers(beforeLayers.map((layer) => (layer.id === updatedLayer.id ? updatedLayer : layer)));
    } else {
      setAfterLayers(afterLayers.map((layer) => (layer.id === updatedLayer.id ? updatedLayer : layer)));
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
