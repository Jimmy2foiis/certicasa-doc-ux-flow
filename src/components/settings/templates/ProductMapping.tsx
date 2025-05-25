
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Save, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ProductMapping {
  id: string;
  productName: string;
  templateVariable: string;
  templateDescription: string;
  pricePerM2: number;
  thermalResistance?: string;
}

const ProductMapping = () => {
  const [mappings, setMappings] = useState<ProductMapping[]>([
    {
      id: "1",
      productName: "SOUFL'R 47",
      templateVariable: "SOUFL_R_47",
      templateDescription: "Aislamiento por soplado R=5.51",
      pricePerM2: 7.00,
      thermalResistance: "R=5.51"
    },
    {
      id: "2",
      productName: "TETRIS SUPER 12",
      templateVariable: "TETRIS_12",
      templateDescription: "Paneles aislantes TETRIS",
      pricePerM2: 7.00,
      thermalResistance: "R=3.15"
    },
    {
      id: "3",
      productName: "URSA GLASSWOOL",
      templateVariable: "URSA_GLASS",
      templateDescription: "Lana de vidrio URSA",
      pricePerM2: 7.00,
      thermalResistance: "R=2.85"
    }
  ]);

  const [editingMapping, setEditingMapping] = useState<ProductMapping | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const handleSaveMapping = (mapping: ProductMapping) => {
    if (mappings.find(m => m.id === mapping.id)) {
      setMappings(prev => prev.map(m => m.id === mapping.id ? mapping : m));
      toast({
        title: "Mapping mis à jour",
        description: "Le mapping produit a été mis à jour avec succès."
      });
    } else {
      const newMapping = { ...mapping, id: Date.now().toString() };
      setMappings(prev => [...prev, newMapping]);
      toast({
        title: "Mapping créé",
        description: "Le nouveau mapping produit a été créé avec succès."
      });
    }
    setEditingMapping(null);
    setShowCreateDialog(false);
  };

  const handleDeleteMapping = (mappingId: string) => {
    setMappings(prev => prev.filter(m => m.id !== mappingId));
    toast({
      title: "Mapping supprimé",
      description: "Le mapping produit a été supprimé avec succès."
    });
  };

  const createNewMapping = () => {
    setEditingMapping({
      id: "",
      productName: "",
      templateVariable: "",
      templateDescription: "",
      pricePerM2: 7.00,
      thermalResistance: ""
    });
    setShowCreateDialog(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🔗 Mapping Produits → Template
            <Button onClick={createNewMapping} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Mapping
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">💡 Comment ça marche :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Chaque produit est associé à une variable de template</li>
                <li>• Le prix fixe de 7€/m² est appliqué pour tous les matériaux</li>
                <li>• La main d'œuvre est calculée automatiquement : ((CAE×0.1)/1.21/surface) - 7€</li>
                <li>• Utilisez les variables dans vos templates : {{`{producto_nombre}`}}, {{`{producto_descripcion}`}}</li>
              </ul>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Variable Template</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Prix/m²</TableHead>
                  <TableHead>Résistance</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">{mapping.productName}</TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {{`{${mapping.templateVariable}}`}}
                      </code>
                    </TableCell>
                    <TableCell>{mapping.templateDescription}</TableCell>
                    <TableCell>{mapping.pricePerM2.toFixed(2)}€</TableCell>
                    <TableCell>{mapping.thermalResistance}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingMapping(mapping);
                            setShowCreateDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMapping(mapping.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour créer/éditer un mapping */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMapping?.id ? "Modifier le mapping" : "Créer un nouveau mapping"}
            </DialogTitle>
          </DialogHeader>
          {editingMapping && (
            <MappingForm
              mapping={editingMapping}
              onSave={handleSaveMapping}
              onCancel={() => {
                setShowCreateDialog(false);
                setEditingMapping(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface MappingFormProps {
  mapping: ProductMapping;
  onSave: (mapping: ProductMapping) => void;
  onCancel: () => void;
}

const MappingForm = ({ mapping, onSave, onCancel }: MappingFormProps) => {
  const [formData, setFormData] = useState(mapping);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Générer automatiquement la variable template à partir du nom du produit
  const generateTemplateVariable = (productName: string) => {
    return productName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const handleProductNameChange = (productName: string) => {
    setFormData(prev => ({
      ...prev,
      productName,
      templateVariable: generateTemplateVariable(productName)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Nom du produit *</Label>
          <Input
            id="productName"
            value={formData.productName}
            onChange={(e) => handleProductNameChange(e.target.value)}
            placeholder="Ex: SOUFL'R 47"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="templateVariable">Variable template *</Label>
          <Input
            id="templateVariable"
            value={formData.templateVariable}
            onChange={(e) => setFormData(prev => ({ ...prev, templateVariable: e.target.value }))}
            placeholder="Ex: SOUFL_R_47"
            required
          />
          <p className="text-xs text-gray-500">
            Utilisez {{`{${formData.templateVariable}}`}} dans vos templates
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="templateDescription">Description pour le template *</Label>
        <Textarea
          id="templateDescription"
          value={formData.templateDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, templateDescription: e.target.value }))}
          placeholder="Ex: Aislamiento por soplado R=5.51"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerM2">Prix par m² (€) *</Label>
          <Input
            id="pricePerM2"
            type="number"
            step="0.01"
            value={formData.pricePerM2}
            onChange={(e) => setFormData(prev => ({ ...prev, pricePerM2: parseFloat(e.target.value) }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thermalResistance">Résistance thermique</Label>
          <Input
            id="thermalResistance"
            value={formData.thermalResistance || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, thermalResistance: e.target.value }))}
            placeholder="Ex: R=5.51"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </form>
  );
};

export default ProductMapping;
