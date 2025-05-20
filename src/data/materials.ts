
export interface Material {
  id: string;
  name: string;
  thickness: number;
  lambda: number | string;
  r: number;
}

export const predefinedMaterials: Material[] = [
  { id: "plaster", name: "Plâtre (Yeso)", thickness: 10, lambda: 0.56, r: 0.018 },
  { id: "wood", name: "Panneau de bois", thickness: 50, lambda: 0.18, r: 0.278 },
  { id: "concrete_reinforced", name: "Béton armé", thickness: 120, lambda: 2.50, r: 0.048 },
  { id: "concrete", name: "Béton", thickness: 20, lambda: 2.50, r: 0.008 },
  { id: "concrete_filling", name: "Remplissage entre poutrelles béton", thickness: 50, lambda: 1.323, r: 0.038 },
  { id: "plaster_mortar", name: "Mortier de plâtre", thickness: 5, lambda: 0.80, r: 0.006 },
  { id: "hollow_brick", name: "Brique creuse", thickness: 70, lambda: 0.42, r: 0.167 },
  { id: "air", name: "Lame d'air", thickness: 50, lambda: "-", r: 0.18 },
  { id: "eps_insulation", name: "Isolant EPS", thickness: 80, lambda: 0.031, r: 2.58 },
  { id: "mineral_wool", name: "Laine minérale", thickness: 100, lambda: 0.035, r: 2.86 },
  { id: "polyurethane", name: "Polyuréthane", thickness: 60, lambda: 0.028, r: 2.14 }
];
