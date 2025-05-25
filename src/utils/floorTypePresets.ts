
import { Material } from "@/data/materials";

export interface FloorTypePreset {
  beforeLayers: Material[];
  afterLayers: Material[];
}

export const floorTypePresets: Record<string, FloorTypePreset> = {
  "Béton": {
    beforeLayers: [
      { id: "yeso1", name: "Yeso", thickness: 15, lambda: 0.56, r: 0.027 },
      { id: "beton1", name: "Béton armé", thickness: 200, lambda: 2.50, r: 0.080 }
    ],
    afterLayers: [
      { id: "yeso2", name: "Yeso", thickness: 15, lambda: 0.56, r: 0.027 },
      { id: "beton2", name: "Béton armé", thickness: 200, lambda: 2.50, r: 0.080 },
      { id: "souflr47_1", name: "SOUFL'R 47", thickness: 259, lambda: 0.047, r: 5.51 }
    ]
  },
  "Bois": {
    beforeLayers: [
      { id: "yeso3", name: "Yeso", thickness: 15, lambda: 0.56, r: 0.027 },
      { id: "bois1", name: "Panneau de bois", thickness: 50, lambda: 0.18, r: 0.278 }
    ],
    afterLayers: [
      { id: "yeso4", name: "Yeso", thickness: 15, lambda: 0.56, r: 0.027 },
      { id: "bois2", name: "Panneau de bois", thickness: 50, lambda: 0.18, r: 0.278 },
      { id: "souflr47_2", name: "SOUFL'R 47", thickness: 259, lambda: 0.047, r: 5.51 }
    ]
  },
  "Céramique": {
    beforeLayers: [
      { id: "yeso5", name: "Yeso", thickness: 15, lambda: 0.56, r: 0.027 },
      { id: "ceramique1", name: "Forjado cerámico", thickness: 300, lambda: 1.05, r: 0.286 }
    ],
    afterLayers: [
      { id: "yeso6", name: "Yeso", thickness: 15, lambda: 0.56, r: 0.027 },
      { id: "ceramique2", name: "Forjado cerámico", thickness: 300, lambda: 1.05, r: 0.286 },
      { id: "souflr47_3", name: "SOUFL'R 47", thickness: 259, lambda: 0.047, r: 5.51 }
    ]
  }
};

export const getFloorTypePreset = (floorType: string): FloorTypePreset | null => {
  return floorTypePresets[floorType] || null;
};
