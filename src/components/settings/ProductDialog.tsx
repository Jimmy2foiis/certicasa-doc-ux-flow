import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { Product, Material, ThicknessOption, calculateThermalResistance, validateThickness, validateLambda, INSTALLATION_METHODS, TVA_OPTIONS } from '@/types/materials';

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
    nomComplet: product?.nomComplet || '',
    manufacturer: product?.manufacturer || '',
    baseMaterialId: product?.baseMaterialId || '',
    lambda: product?.lambda?.toString() || '',
    defaultThickness: product?.defaultThickness?.toString() || '',
    thicknessOptions: product?.thicknessOptions || [],
    pricePerM2: product?.pricePerM2?.toString() || '',
    type: product?.type || '',
    methodeInstallation: product?.methodeInstallation || '',
    tvaApplicable: product?.tvaApplicable || 10,
    descriptionTechnique: product?.descriptionTechnique || '',
    descriptionFacture: product?.descriptionFacture || '',
    caracteristiques: product?.caracteristiques || {
      epaisseur: 0,
      resistanceThermique: 0,
      conductivite: 0,
      densite: '',
      reactionFeu: '',
      certificat: '',
      marquageCE: '',
      classeAsentamiento: '',
      emissions: ''
    },
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
      nomComplet: formData.nomComplet,
      manufacturer: formData.manufacturer,
      baseMaterialId: formData.baseMaterialId,
      lambda,
      defaultThickness,
      defaultR,
      thicknessOptions: formData.thicknessOptions,
      pricePerM2: formData.pricePerM2 ? parseFloat(formData.pricePerM2) : undefined,
      type: formData.type,
      methodeInstallation: formData.methodeInstallation as any,
      tvaApplicable: formData.tvaApplicable,
      tvaOptions: TVA_OPTIONS,
      caracteristiques: formData.caracteristiques,
      descriptionTechnique: formData.descriptionTechnique,
      descriptionFacture: formData.descriptionFacture,
      isActive: formData.isActive
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nomComplet: '',
      manufacturer: '',
      baseMaterialId: '',
      lambda: '',
      defaultThickness: '',
      thicknessOptions: [],
      pricePerM2: '',
      type: '',
      methodeInstallation: '',
      tvaApplicable: 10,
      descriptionTechnique: '',
      descriptionFacture: '',
      caracteristiques: {
        epaisseur: 0,
        resistanceThermique: 0,
        conductivite: 0,
        densite: '',
        reactionFeu: '',
        certificat: '',
        marquageCE: '',
        classeAsentamiento: '',
        emissions: ''
      },
      isActive: true
    });
    setCalculatedR(null);
    setValidationErrors([]);
  };

  const addThicknessOption = () => {
    const thickness = parseFloat(newThickness);
    const lambda = parseFloat(formData.lambda);
    
    if (thickness > 0 && lambda > 0) {
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="technical">Caractéristiques techniques</TabsTrigger>
              <TabsTrigger value="pricing">Prix et TVA</TabsTrigger>
              <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nom commercial</Label>
                  <Input
                    id="productName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: SOUFL'R 47"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomComplet">Nom complet</Label>
                  <Input
                    id="nomComplet"
                    value={formData.nomComplet}
                    onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                    placeholder="Ex: URSA SOUFL'R 47"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="type">Type de produit</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Ex: Lana mineral a granel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="methodeInstallation">Méthode d'installation</Label>
                  <Select value={formData.methodeInstallation} onValueChange={(value) => setFormData({ ...formData, methodeInstallation: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTALLATION_METHODS.map(method => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultThickness">Épaisseur par défaut (mm)</Label>
                  <Input
                    id="defaultThickness"
                    type="number"
                    value={formData.defaultThickness}
                    onChange={(e) => handleThicknessChange(e.target.value)}
                    placeholder="335"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productLambda">Conductivité λ (W/m·K)</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="densite">Densité</Label>
                  <Input
                    id="densite"
                    value={formData.caracteristiques.densite}
                    onChange={(e) => setFormData({
                      ...formData,
                      caracteristiques: { ...formData.caracteristiques, densite: e.target.value }
                    })}
                    placeholder="10-15 kg/m³"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reactionFeu">Réaction au feu</Label>
                  <Input
                    id="reactionFeu"
                    value={formData.caracteristiques.reactionFeu}
                    onChange={(e) => setFormData({
                      ...formData,
                      caracteristiques: { ...formData.caracteristiques, reactionFeu: e.target.value }
                    })}
                    placeholder="Euroclase A1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificat">Certificat ACERMI</Label>
                  <Input
                    id="certificat"
                    value={formData.caracteristiques.certificat}
                    onChange={(e) => setFormData({
                      ...formData,
                      caracteristiques: { ...formData.caracteristiques, certificat: e.target.value }
                    })}
                    placeholder="14/D/058/950"
                  />
                </div>
              </div>

              {calculatedR !== null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    → <strong>Résistance thermique R = {calculatedR.toFixed(2)} m²·K/W</strong>
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix unitaire (€/m²)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerM2}
                    onChange={(e) => setFormData({ ...formData, pricePerM2: e.target.value })}
                    placeholder="7.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tva">TVA applicable (%)</Label>
                  <Select 
                    value={formData.tvaApplicable.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, tvaApplicable: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TVA_OPTIONS.map(tva => (
                        <SelectItem key={tva} value={tva.toString()}>
                          {tva}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="descriptions" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descriptionTechnique">Description technique</Label>
                <Textarea
                  id="descriptionTechnique"
                  value={formData.descriptionTechnique}
                  onChange={(e) => setFormData({ ...formData, descriptionTechnique: e.target.value })}
                  placeholder="Description technique complète du produit..."
                  rows={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionFacture">Description pour facture</Label>
                <Textarea
                  id="descriptionFacture"
                  value={formData.descriptionFacture}
                  onChange={(e) => setFormData({ ...formData, descriptionFacture: e.target.value })}
                  placeholder="Description courte pour les factures..."
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="productActive">Produit actif</Label>
              <Switch
                id="productActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
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
