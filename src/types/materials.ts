
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

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  baseMaterialId: string;
  lambda: number;
  availableThicknesses: number[]; // en mm
  pricePerM2?: number;
  technicalSheetUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
