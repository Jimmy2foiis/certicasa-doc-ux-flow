
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { useMaterialsAndProducts } from '@/hooks/useMaterialsAndProducts';
import { Material, Product, MATERIAL_CATEGORIES } from '@/types/materials';
import { useToast } from '@/hooks/use-toast';
import MaterialDialog from './MaterialDialog';
import ProductDialog from './ProductDialog';

const MaterialsAndProductsSection = () => {
  const { toast } = useToast();
  const {
    materials,
    products,
    loading,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addProduct,
    updateProduct,
    deleteProduct
  } = useMaterialsAndProducts();

  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const getCategoryLabel = (categoryId: string) => {
    return MATERIAL_CATEGORIES.find(cat => cat.id === categoryId)?.label || categoryId;
  };

  const getMaterialName = (materialId: string) => {
    return materials.find(m => m.id === materialId)?.name || 'Matériau introuvable';
  };

  const handleMaterialSave = (materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, materialData);
      toast({
        title: 'Matériau modifié',
        description: 'Le matériau a été modifié avec succès.'
      });
    } else {
      addMaterial(materialData);
      toast({
        title: 'Matériau créé',
        description: 'Le nouveau matériau a été créé avec succès.'
      });
    }
    setEditingMaterial(undefined);
  };

  const handleProductSave = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: 'Produit modifié',
        description: 'Le produit a été modifié avec succès.'
      });
    } else {
      addProduct(productData);
      toast({
        title: 'Produit créé',
        description: 'Le nouveau produit a été créé avec succès.'
      });
    }
    setEditingProduct(undefined);
  };

  const handleDeleteMaterial = (material: Material) => {
    // Vérifier si le matériau est utilisé par des produits
    const usedByProducts = products.filter(p => p.baseMaterialId === material.id);
    if (usedByProducts.length > 0) {
      toast({
        title: 'Impossible de supprimer',
        description: `Ce matériau est utilisé par ${usedByProducts.length} produit(s).`,
        variant: 'destructive'
      });
      return;
    }

    deleteMaterial(material.id);
    toast({
      title: 'Matériau supprimé',
      description: 'Le matériau a été supprimé avec succès.'
    });
  };

  const handleDeleteProduct = (product: Product) => {
    deleteProduct(product.id);
    toast({
      title: 'Produit supprimé',
      description: 'Le produit a été supprimé avec succès.'
    });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Matériaux et Produits</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="materials" className="space-y-4">
          <TabsList>
            <TabsTrigger value="materials">Matériaux ({materials.length})</TabsTrigger>
            <TabsTrigger value="products">Produits ({products.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Matériaux de base</h3>
              <Button onClick={() => setMaterialDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un matériau
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>λ (W/m·K)</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{getCategoryLabel(material.category)}</TableCell>
                    <TableCell>{material.lambda}</TableCell>
                    <TableCell>
                      <Badge variant={material.isActive ? 'default' : 'secondary'}>
                        {material.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMaterial(material);
                            setMaterialDialogOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMaterial(material)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Produits commerciaux</h3>
              <Button onClick={() => setProductDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom commercial</TableHead>
                  <TableHead>Fabricant</TableHead>
                  <TableHead>Matériau de base</TableHead>
                  <TableHead>λ (W/m·K)</TableHead>
                  <TableHead>Épaisseurs</TableHead>
                  <TableHead>Prix/m²</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.manufacturer}</TableCell>
                    <TableCell>{getMaterialName(product.baseMaterialId)}</TableCell>
                    <TableCell>{product.lambda}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.availableThicknesses.slice(0, 3).map(thickness => (
                          <Badge key={thickness} variant="outline" className="text-xs">
                            {thickness}mm
                          </Badge>
                        ))}
                        {product.availableThicknesses.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.availableThicknesses.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.pricePerM2 ? `${product.pricePerM2}€` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setProductDialogOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <MaterialDialog
          isOpen={materialDialogOpen}
          onClose={() => {
            setMaterialDialogOpen(false);
            setEditingMaterial(undefined);
          }}
          onSave={handleMaterialSave}
          material={editingMaterial}
        />

        <ProductDialog
          isOpen={productDialogOpen}
          onClose={() => {
            setProductDialogOpen(false);
            setEditingProduct(undefined);
          }}
          onSave={handleProductSave}
          product={editingProduct}
          materials={materials}
        />
      </CardContent>
    </Card>
  );
};

export default MaterialsAndProductsSection;
