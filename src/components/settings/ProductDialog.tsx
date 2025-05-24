
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Product, Material } from '@/types/materials';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  product?: Product;
  materials: Material[];
}

const ProductDialog = ({ isOpen, onClose, onSave, product, materials }: ProductDialogProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    manufacturer: product?.manufacturer || '',
    baseMaterialId: product?.baseMaterialId || '',
    lambda: product?.lambda?.toString() || '',
    availableThicknesses: product?.availableThicknesses || [],
    pricePerM2: product?.pricePerM2?.toString() || '',
    isActive: product?.isActive ?? true
  });

  const [newThickness, setNewThickness] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.manufacturer || !formData.baseMaterialId || !formData.lambda) return;

    const lambda = parseFloat(formData.lambda);
    if (lambda <= 0 || lambda > 0.5) return;

    onSave({
      name: formData.name,
      manufacturer: formData.manufacturer,
      baseMaterialId: formData.baseMaterialId,
      lambda,
      availableThicknesses: formData.availableThicknesses,
      pricePerM2: formData.pricePerM2 ? parseFloat(formData.pricePerM2) : undefined,
      isActive: formData.isActive
    });

    onClose();
    setFormData({
      name: '',
      manufacturer: '',
      baseMaterialId: '',
      lambda: '',
      availableThicknesses: [],
      pricePerM2: '',
      isActive: true
    });
  };

  const addThickness = () => {
    const thickness = parseInt(newThickness);
    if (thickness > 0 && !formData.availableThicknesses.includes(thickness)) {
      setFormData({
        ...formData,
        availableThicknesses: [...formData.availableThicknesses, thickness].sort((a, b) => a - b)
      });
      setNewThickness('');
    }
  };

  const removeThickness = (thickness: number) => {
    setFormData({
      ...formData,
      availableThicknesses: formData.availableThicknesses.filter(t => t !== thickness)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Nom commercial</Label>
            <Input
              id="productName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: URSOUF 47"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturer">Fabricant</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              placeholder="Ex: URSA"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseMaterial">Matériau de base</Label>
            <Select value={formData.baseMaterialId} onValueChange={(value) => setFormData({ ...formData, baseMaterialId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un matériau" />
              </SelectTrigger>
              <SelectContent>
                {materials.filter(m => m.isActive).map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} (λ = {material.lambda})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productLambda">Valeur λ spécifique (W/m·K)</Label>
            <Input
              id="productLambda"
              type="number"
              step="0.001"
              min="0.01"
              max="0.5"
              value={formData.lambda}
              onChange={(e) => setFormData({ ...formData, lambda: e.target.value })}
              placeholder="0.047"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Épaisseurs disponibles (mm)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={newThickness}
                onChange={(e) => setNewThickness(e.target.value)}
                placeholder="Ex: 200"
                min="1"
              />
              <Button type="button" onClick={addThickness} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.availableThicknesses.map(thickness => (
                <Badge key={thickness} variant="secondary" className="flex items-center gap-1">
                  {thickness}mm
                  <button
                    type="button"
                    onClick={() => removeThickness(thickness)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix/m² (€) - optionnel</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.pricePerM2}
              onChange={(e) => setFormData({ ...formData, pricePerM2: e.target.value })}
              placeholder="12.50"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="productActive">Produit actif</Label>
            <Switch
              id="productActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {product ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
