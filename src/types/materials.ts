
export interface Material {
  id: string;
  name: string;
  category: 'mineral_wool' | 'synthetic' | 'natural' | 'other';
  lambda: number; // W/m·K
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThicknessOption {
  thickness: number; // en mm
  r: number; // R calculé pour cette épaisseur
}

export interface TechnicalCharacteristics {
  epaisseur: number; // mm
  resistanceThermique: number; // m²·K/W
  conductivite: number; // W/m·K
  densite?: string;
  reactionFeu?: string;
  certificat?: string;
  marquageCE?: string;
  classeAsentamiento?: string;
  emissions?: string;
}

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  baseMaterialId: string;
  lambda: number; // Conductivité thermique
  defaultThickness?: number; // Épaisseur par défaut en mm
  defaultR?: number; // R calculé pour l'épaisseur par défaut
  thicknessOptions: ThicknessOption[];
  pricePerM2?: number;
  technicalSheetUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Nouveaux champs pour la fiche produit complète
  nomComplet?: string;
  type?: string;
  methodeInstallation?: 'SOUFFLE' | 'RAMPANTS' | 'PANNEAU' | 'ROULEAU';
  tvaApplicable?: number;
  tvaOptions?: number[];
  caracteristiques?: TechnicalCharacteristics;
  descriptionTechnique?: string;
  descriptionFacture?: string;
  avantages?: string[];
  certifications?: string[];
}

export interface MaterialCategory {
  id: string;
  label: string;
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  { id: 'mineral_wool', label: 'Laines minérales' },
  { id: 'synthetic', label: 'Isolants synthétiques' },
  { id: 'natural', label: 'Isolants naturels' },
  { id: 'other', label: 'Autres' }
];

export const INSTALLATION_METHODS = [
  { id: 'SOUFFLE', label: 'Soufflé (Soplado)' },
  { id: 'RAMPANTS', label: 'Rampants' },
  { id: 'PANNEAU', label: 'Panneau' },
  { id: 'ROULEAU', label: 'Rouleau' }
];

export const TVA_OPTIONS = [10, 21];

// Utility function to calculate thermal resistance
export const calculateThermalResistance = (thickness: number, lambda: number, unit: 'mm' | 'cm' | 'm' = 'mm'): number => {
  // Convert thickness to meters
  let thicknessInMeters: number;
  switch (unit) {
    case 'mm':
      thicknessInMeters = thickness / 1000;
      break;
    case 'cm':
      thicknessInMeters = thickness / 100;
      break;
    case 'm':
      thicknessInMeters = thickness;
      break;
    default:
      thicknessInMeters = thickness / 1000;
  }
  
  return thicknessInMeters / lambda;
};

// Validation functions
export const validateThickness = (thickness: number): boolean => {
  return thickness > 0;
};

export const validateLambda = (lambda: number): boolean => {
  return lambda >= 0.01 && lambda <= 0.5;
};
