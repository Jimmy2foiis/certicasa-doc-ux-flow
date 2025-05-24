
import { useState, useEffect } from 'react';
import { Material, Product } from '@/types/materials';

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
    id: 'ursotop_47',
    name: 'URSOTOP 47 KRAFT',
    manufacturer: 'URSA',
    baseMaterialId: 'glass_wool',
    lambda: 0.047,
    availableThicknesses: [100, 120, 140, 160, 180, 200, 240, 260, 280, 300],
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
    availableThicknesses: [200, 240, 280, 300, 320, 350, 380, 400],
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
    availableThicknesses: [200, 240, 280, 300, 320, 350, 380, 400],
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
    getActiveProducts
  };
};
