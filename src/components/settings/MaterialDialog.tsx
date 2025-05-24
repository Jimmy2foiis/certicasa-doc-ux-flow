
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Material, MATERIAL_CATEGORIES } from '@/types/materials';

interface MaterialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => void;
  material?: Material;
}

const MaterialDialog = ({ isOpen, onClose, onSave, material }: MaterialDialogProps) => {
  const [formData, setFormData] = useState({
    name: material?.name || '',
    category: (material?.category || 'mineral_wool') as Material['category'],
    lambda: material?.lambda?.toString() || '',
    description: material?.description || '',
    isActive: material?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.lambda) return;

    const lambda = parseFloat(formData.lambda);
    if (lambda <= 0 || lambda > 0.5) return;

    onSave({
      name: formData.name,
      category: formData.category,
      lambda,
      description: formData.description,
      isActive: formData.isActive
    });

    onClose();
    setFormData({
      name: '',
      category: 'mineral_wool',
      lambda: '',
      description: '',
      isActive: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {material ? 'Modifier le matériau' : 'Nouveau matériau'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du matériau</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Laine de verre haute performance"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value: Material['category']) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lambda">Valeur λ (W/m·K)</Label>
            <Input
              id="lambda"
              type="number"
              step="0.001"
              min="0.01"
              max="0.5"
              value={formData.lambda}
              onChange={(e) => setFormData({ ...formData, lambda: e.target.value })}
              placeholder="0.035"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnelle)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du matériau..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Matériau actif</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {material ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDialog;
