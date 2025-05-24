
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { Product, Material, ThicknessOption, calculateThermalResistance, validateThickness, validateLambda } from '@/types/materials';

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
    defaultThickness: product?.defaultThickness?.toString() || '',
    thicknessOptions: product?.thicknessOptions || [],
    pricePerM2: product?.pricePerM2?.toString() || '',
    isActive: product?.isActive ?? true
  });

  const [newThickness, setNewThickness] = useState('');
  const [thicknessUnit, setThicknessUnit] = useState<'mm' | 'cm' | 'm'>('mm');
  const [calculatedR, setCalculatedR] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Calculate R in real time when thickness or lambda changes
  const updateCalculatedR = (thickness: string, lambda: string, unit: 'mm' | 'cm' | 'm' = 'mm') => {
    const thicknessNum = parseFloat(thickness);
    const lambdaNum = parseFloat(lambda);
    
    if (thicknessNum > 0 && lambdaNum > 0) {
      const r = calculateThermalResistance(thicknessNum, lambdaNum, unit);
      setCalculatedR(r);
    } else {
      setCalculatedR(null);
    }
  };

  // Validate form data
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push('Le nom commercial est requis');
    if (!formData.manufacturer.trim()) errors.push('Le fabricant est requis');
    if (!formData.baseMaterialId) errors.push('Le matériau de base est requis');
    
    const lambdaNum = parseFloat(formData.lambda);
    if (!formData.lambda || isNaN(lambdaNum)) {
      errors.push('La conductivité thermique λ est requise');
    } else if (!validateLambda(lambdaNum)) {
      errors.push('La conductivité thermique λ doit être entre 0.01 et 0.5 W/m·K');
    }
    
    if (formData.defaultThickness) {
      const thicknessNum = parseFloat(formData.defaultThickness);
      if (isNaN(thicknessNum) || !validateThickness(thicknessNum)) {
        errors.push('L\'épaisseur par défaut doit être supérieure à 0');
      }
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const lambda = parseFloat(formData.lambda);
    const defaultThickness = formData.defaultThickness ? parseFloat(formData.defaultThickness) : undefined;
    const defaultR = defaultThickness ? calculateThermalResistance(defaultThickness, lambda, 'mm') : undefined;

    onSave({
      name: formData.name,
      manufacturer: formData.manufacturer,
      baseMaterialId: formData.baseMaterialId,
      lambda,
      defaultThickness,
      defaultR,
      thicknessOptions: formData.thicknessOptions,
      pricePerM2: formData.pricePerM2 ? parseFloat(formData.pricePerM2) : undefined,
      isActive: formData.isActive
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      manufacturer: '',
      baseMaterialId: '',
      lambda: '',
      defaultThickness: '',
      thicknessOptions: [],
      pricePerM2: '',
      isActive: true
    });
    setCalculatedR(null);
    setValidationErrors([]);
  };

  const addThicknessOption = () => {
    const thickness = parseFloat(newThickness);
    const lambda = parseFloat(formData.lambda);
    
    if (thickness > 0 && lambda > 0) {
      // Convert thickness to mm for storage
      let thicknessInMm: number;
      switch (thicknessUnit) {
        case 'mm':
          thicknessInMm = thickness;
          break;
        case 'cm':
          thicknessInMm = thickness * 10;
          break;
        case 'm':
          thicknessInMm = thickness * 1000;
          break;
      }
      
      const r = calculateThermalResistance(thickness, lambda, thicknessUnit);
      const newOption: ThicknessOption = { thickness: thicknessInMm, r };
      
      // Check if thickness already exists
      if (!formData.thicknessOptions.some(opt => opt.thickness === thicknessInMm)) {
        setFormData({
          ...formData,
          thicknessOptions: [...formData.thicknessOptions, newOption].sort((a, b) => a.thickness - b.thickness)
        });
        setNewThickness('');
      }
    }
  };

  const removeThicknessOption = (thickness: number) => {
    setFormData({
      ...formData,
      thicknessOptions: formData.thicknessOptions.filter(opt => opt.thickness !== thickness)
    });
  };

  // Update calculated R when thickness or lambda changes
  const handleThicknessChange = (value: string) => {
    setFormData({ ...formData, defaultThickness: value });
    updateCalculatedR(value, formData.lambda, 'mm');
  };

  const handleLambdaChange = (value: string) => {
    setFormData({ ...formData, lambda: value });
    updateCalculatedR(formData.defaultThickness, value, 'mm');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </DialogTitle>
        </DialogHeader>
        
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Calcul de la résistance thermique</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="defaultThickness">Épaisseur par défaut (mm)</Label>
                <Input
                  id="defaultThickness"
                  type="number"
                  value={formData.defaultThickness}
                  onChange={(e) => handleThicknessChange(e.target.value)}
                  placeholder="200"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productLambda">Conductivité thermique λ (W/m·K)</Label>
                <Input
                  id="productLambda"
                  type="number"
                  step="0.001"
                  min="0.01"
                  max="0.5"
                  value={formData.lambda}
                  onChange={(e) => handleLambdaChange(e.target.value)}
                  placeholder="0.047"
                  required
                />
              </div>
            </div>

            {calculatedR !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  → <strong>Résistance thermique R = {calculatedR.toFixed(2)} m²·K/W</strong>
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Épaisseurs standard disponibles</h3>
            
            <div className="flex gap-2 mb-4">
              <Input
                type="number"
                value={newThickness}
                onChange={(e) => setNewThickness(e.target.value)}
                placeholder="200"
                min="1"
                className="flex-1"
              />
              <Select value={thicknessUnit} onValueChange={(value: 'mm' | 'cm' | 'm') => setThicknessUnit(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">mm</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addThicknessOption} size="sm" disabled={!newThickness || !formData.lambda}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData.thicknessOptions.map(option => (
                <div key={option.thickness} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">
                    {option.thickness}mm → R = {option.r.toFixed(2)} m²·K/W
                  </span>
                  <button
                    type="button"
                    onClick={() => removeThicknessOption(option.thickness)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
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
