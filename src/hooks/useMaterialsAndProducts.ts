import { useState, useEffect } from 'react';
import { Material, Product, ThicknessOption } from '@/types/materials';

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'glass_wool',
    name: 'Laine de verre',
    category: 'mineral_wool',
    lambda: 0.035,
    description: 'Isolant minéral traditionnel',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rock_wool',
    name: 'Laine de roche',
    category: 'mineral_wool',
    lambda: 0.038,
    description: 'Isolant minéral incombustible',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'eps',
    name: 'Polystyrène expansé',
    category: 'synthetic',
    lambda: 0.038,
    description: 'Isolant synthétique économique',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'polyurethane',
    name: 'Polyuréthane',
    category: 'synthetic',
    lambda: 0.022,
    description: 'Isolant haute performance',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'wood_fiber',
    name: 'Fibre de bois',
    category: 'natural',
    lambda: 0.038,
    description: 'Isolant naturel respirant',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cellulose',
    name: 'Ouate de cellulose',
    category: 'natural',
    lambda: 0.040,
    description: 'Isolant naturel en vrac',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'URSA_SOUFLR_47',
    name: 'SOUFL\'R 47',
    nomComplet: 'URSA SOUFL\'R 47',
    manufacturer: 'URSA',
    baseMaterialId: 'glass_wool',
    lambda: 0.047,
    defaultThickness: 335,
    defaultR: 7.00,
    type: 'Lana mineral a granel para insuflado (soplado)',
    methodeInstallation: 'SOUFFLE',
    pricePerM2: 7,
    tvaApplicable: 10,
    tvaOptions: [10, 21],
    caracteristiques: {
      epaisseur: 335,
      resistanceThermique: 7.00,
      conductivite: 0.047,
      densite: '10-15 kg/m³',
      reactionFeu: 'Euroclase A1 (no inflamable)',
      certificat: 'ACERMI n° 14/D/058/950',
      marquageCE: 'UNE EN 14064-1',
      classeAsentamiento: 'S1',
      emissions: 'A+ (muy bajas)'
    },
    descriptionTechnique: `Aislamiento térmico por soplado de lana mineral de altas prestaciones.

CARACTERÍSTICAS TÉCNICAS:
• Espesor instalado: 335 mm
• Resistencia térmica (R): 7,00 m²·K/W
• Conductividad térmica (λ): 0,047 W/m·K
• Densidad instalada: 10-15 kg/m³
• Reacción al fuego: Euroclase A1 (no inflamable)

CERTIFICACIONES:
• Marcado CE según UNE EN 14064-1
• Certificación ACERMI n° 14/D/058/950
• Clase de asentamiento: S1
• Emisiones interiores: A+ (muy bajas)

VENTAJAS:
✓ Sin puentes térmicos
✓ Muy permeable al vapor (MU1)
✓ Respetuoso con el medio ambiente
✓ Instalación rápida y limpia`,
    descriptionFacture: 'Suministro e instalación de aislamiento térmico URSA SOUFL\'R 47 mediante insuflado (soplado) en forjado, cumpliendo normativa técnica vigente.',
    avantages: [
      'Sin puentes térmicos',
      'Muy permeable al vapor (MU1)',
      'Respetuoso con el medio ambiente',
      'Instalación rápida y limpia'
    ],
    certifications: [
      'Marcado CE según UNE EN 14064-1',
      'Certificación ACERMI n° 14/D/058/950',
      'Clase de asentamiento: S1',
      'Emisiones interiores: A+ (muy bajas)'
    ],
    thicknessOptions: [
      { thickness: 335, r: 7.00 }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'URSA_TETRIS_SUPER_12',
    name: 'TETRIS SUPER 12',
    nomComplet: 'URSA TETRIS SUPER 12',
    manufacturer: 'URSA',
    baseMaterialId: 'glass_wool',
    lambda: 0.037,
    defaultThickness: 120,
    defaultR: 3.24,
    type: 'Panel rígido de lana mineral para rampants',
    methodeInstallation: 'RAMPANTS',
    pricePerM2: 12,
    tvaApplicable: 10,
    tvaOptions: [10, 21],
    caracteristiques: {
      epaisseur: 120,
      resistanceThermique: 3.24,
      conductivite: 0.037,
      densite: '12-15 kg/m³',
      reactionFeu: 'Euroclase A1',
      certificat: 'ACERMI n° 14/D/058/951',
      marquageCE: 'UNE EN 13162',
      emissions: 'A+'
    },
    descriptionTechnique: `Panel rígido de lana mineral para aislamiento de rampants.

CARACTERÍSTICAS TÉCNICAS:
• Espesor: 120 mm
• Resistencia térmica (R): 3,24 m²·K/W
• Conductividad térmica (λ): 0,037 W/m·K
• Densidad: 12-15 kg/m³
• Reacción al fuego: Euroclase A1

VENTAJAS:
✓ Fácil instalación en rampants
✓ Excelente comportamiento mecánico
✓ Resistente a la humedad
✓ No se asienta con el tiempo`,
    descriptionFacture: 'Suministro e instalación de aislamiento térmico URSA TETRIS SUPER 12 en rampants, cumpliendo normativa técnica vigente.',
    thicknessOptions: [
      { thickness: 60, r: 1.62 },
      { thickness: 80, r: 2.16 },
      { thickness: 100, r: 2.70 },
      { thickness: 120, r: 3.24 },
      { thickness: 140, r: 3.78 },
      { thickness: 160, r: 4.32 }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ursotop_47',
    name: 'URSOTOP 47 KRAFT',
    manufacturer: 'URSA',
    baseMaterialId: 'glass_wool',
    lambda: 0.047,
    defaultThickness: 200,
    defaultR: 4.26,
    thicknessOptions: [
      { thickness: 100, r: 2.13 },
      { thickness: 120, r: 2.55 },
      { thickness: 140, r: 2.98 },
      { thickness: 160, r: 3.40 },
      { thickness: 180, r: 3.83 },
      { thickness: 200, r: 4.26 },
      { thickness: 240, r: 5.11 },
      { thickness: 260, r: 5.53 },
      { thickness: 280, r: 5.96 },
      { thickness: 300, r: 6.38 }
    ],
    pricePerM2: 12.50,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ursouf_45',
    name: 'URSOUF 45 EP',
    manufacturer: 'URSA',
    baseMaterialId: 'glass_wool',
    lambda: 0.045,
    defaultThickness: 300,
    defaultR: 6.67,
    thicknessOptions: [
      { thickness: 200, r: 4.44 },
      { thickness: 240, r: 5.33 },
      { thickness: 280, r: 6.22 },
      { thickness: 300, r: 6.67 },
      { thickness: 320, r: 7.11 },
      { thickness: 350, r: 7.78 },
      { thickness: 380, r: 8.44 },
      { thickness: 400, r: 8.89 }
    ],
    pricePerM2: 8.20,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ursouf_47',
    name: 'URSOUF 47',
    manufacturer: 'URSA',
    baseMaterialId: 'glass_wool',
    lambda: 0.047,
    defaultThickness: 300,
    defaultR: 6.38,
    thicknessOptions: [
      { thickness: 200, r: 4.26 },
      { thickness: 240, r: 5.11 },
      { thickness: 280, r: 5.96 },
      { thickness: 300, r: 6.38 },
      { thickness: 320, r: 6.81 },
      { thickness: 350, r: 7.45 },
      { thickness: 380, r: 8.09 },
      { thickness: 400, r: 8.51 }
    ],
    pricePerM2: 7.80,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useMaterialsAndProducts = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedMaterials = localStorage.getItem('materials');
    const savedProducts = localStorage.getItem('products');

    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
    } else {
      setMaterials(DEFAULT_MATERIALS);
      localStorage.setItem('materials', JSON.stringify(DEFAULT_MATERIALS));
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    setLoading(false);
  };

  const saveMaterials = (newMaterials: Material[]) => {
    setMaterials(newMaterials);
    localStorage.setItem('materials', JSON.stringify(newMaterials));
  };

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const addMaterial = (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMaterial: Material = {
      ...material,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedMaterials = [...materials, newMaterial];
    saveMaterials(updatedMaterials);
    return newMaterial;
  };

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    const updatedMaterials = materials.map(material => 
      material.id === id 
        ? { ...material, ...updates, updatedAt: new Date() }
        : material
    );
    saveMaterials(updatedMaterials);
  };

  const deleteMaterial = (id: string) => {
    const updatedMaterials = materials.filter(material => material.id !== id);
    saveMaterials(updatedMaterials);
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    );
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    saveProducts(updatedProducts);
  };

  const getActiveMaterials = () => materials.filter(m => m.isActive);
  const getActiveProducts = () => products.filter(p => p.isActive);

  const getProductsByInstallationMethod = (method: string) => 
    products.filter(p => p.isActive && p.methodeInstallation === method);

  return {
    materials,
    products,
    loading,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addProduct,
    updateProduct,
    deleteProduct,
    getActiveMaterials,
    getActiveProducts,
    getProductsByInstallationMethod
  };
};
