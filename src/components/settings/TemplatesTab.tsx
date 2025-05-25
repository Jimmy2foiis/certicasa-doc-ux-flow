
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Save, Download, Upload, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import TemplateEditor from "./templates/TemplateEditor";
import TemplatesList from "./templates/TemplatesList";
import ProductMapping from "./templates/ProductMapping";

interface Template {
  id: string;
  name: string;
  type: "facture" | "devis";
  content: string;
  created_at: string;
  updated_at: string;
}

const TemplatesTab = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Template Standard",
      type: "facture",
      content: `FACTURA {{numero_factura}}
Cliente: {{cliente_nombre}}
NIF: {{cliente_nif}}
Zona climática: {{zona_climatica}}

Economía anual: {{cae_kwh}} kWh/año
Precio de compra: {{precio_rachat}} €/kWh

┌─────────────────────────────────────────┐
│ Descripción  │ Cant │ PU HT │ Total HT  │
├─────────────────────────────────────────┤
│ {{producto_nombre}}                     │
│ {{producto_descripcion}}                │
│              │ {{superficie}}m² │ {{precio_material}}€ │ {{total_material}}€ │
├─────────────────────────────────────────┤
│ MANO DE OBRA │ {{superficie}}m² │ {{precio_mo}}€ │ {{total_mo}}€ │
└─────────────────────────────────────────┘

Base imponible: {{total_ht}}€
IVA ({{tva_taux}}%): {{tva_montant}}€
TOTAL: {{total_ttc}}€`,
      created_at: "2025-01-15",
      updated_at: "2025-01-15"
    },
    {
      id: "2",
      name: "Template Devis",
      type: "devis",
      content: `PRESUPUESTO {{numero_presupuesto}}
Cliente: {{cliente_nombre}}
Fecha: {{fecha_hoy}}

Proyecto de aislamiento
Superficie: {{superficie}}m²
Zona climática: {{zona_climatica}}

Detalles del presupuesto:
- Material: {{producto_nombre}}
- Precio/m²: {{precio_material}}€
- Total material: {{total_material}}€
- Mano de obra: {{total_mo}}€

TOTAL PRESUPUESTO: {{total_ttc}}€`,
      created_at: "2025-01-15",
      updated_at: "2025-01-15"
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateTemplate = () => {
    setSelectedTemplate({
      id: Date.now().toString(),
      name: "Nouveau Template",
      type: "facture",
      content: "",
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    });
    setIsEditing(true);
    setShowCreateDialog(false);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    if (templates.find(t => t.id === updatedTemplate.id)) {
      setTemplates(prev => prev.map(t => 
        t.id === updatedTemplate.id ? { ...updatedTemplate, updated_at: new Date().toISOString().split('T')[0] } : t
      ));
    } else {
      setTemplates(prev => [...prev, updatedTemplate]);
    }
    setIsEditing(false);
    setSelectedTemplate(null);
    toast({
      title: "Template sauvegardé",
      description: "Le template a été sauvegardé avec succès."
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template supprimé",
      description: "Le template a été supprimé avec succès."
    });
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copie)`,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, duplicated]);
    toast({
      title: "Template dupliqué",
      description: "Le template a été dupliqué avec succès."
    });
  };

  if (isEditing && selectedTemplate) {
    return (
      <TemplateEditor
        template={selectedTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setIsEditing(false);
          setSelectedTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📄 Templates de Facture
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouveau template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nom du template</Label>
                    <Input id="template-name" placeholder="Nom du template" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Type</Label>
                    <Select defaultValue="facture">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facture">Facture</SelectItem>
                        <SelectItem value="devis">Devis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Créer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="templates" className="w-full">
            <TabsList>
              <TabsTrigger value="templates">Liste des Templates</TabsTrigger>
              <TabsTrigger value="mapping">Mapping Produits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates">
              <TemplatesList
                templates={templates}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                onDuplicate={handleDuplicateTemplate}
              />
            </TabsContent>
            
            <TabsContent value="mapping">
              <ProductMapping />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatesTab;
