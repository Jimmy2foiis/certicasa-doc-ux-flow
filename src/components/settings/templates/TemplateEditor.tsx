
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TemplateVariables from "./TemplateVariables";
import TemplatePreview from "./TemplatePreview";

interface Template {
  id: string;
  name: string;
  type: "facture" | "devis";
  content: string;
  layout: {
    elements: Array<{
      id: string;
      type: 'text' | 'variable' | 'table' | 'logo' | 'mentions';
      content: string;
      position: { x: number; y: number };
      style: {
        fontSize: number;
        fontWeight: string;
        color: string;
        textAlign: string;
        backgroundColor?: string;
        padding?: string;
        margin?: string;
      };
    }>;
    styles: {
      fontSize: number;
      fontFamily: string;
      lineHeight: number;
      margins: { top: number; right: number; bottom: number; left: number };
    };
  };
  logo?: {
    url: string;
    position: string;
    size: number;
  };
  created_at: string;
  updated_at: string;
}

interface TemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

const TemplateEditor = ({ template, onSave, onCancel }: TemplateEditorProps) => {
  const [editedTemplate, setEditedTemplate] = useState<Template>(template);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    onSave(editedTemplate);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = editedTemplate.content;
      const newContent = content.substring(0, start) + `{{${variable}}}` + content.substring(end);
      
      setEditedTemplate(prev => ({ ...prev, content: newContent }));
      
      // Remettre le curseur après la variable insérée
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold">Éditeur de Template</h2>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Prévisualiser
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Prévisualisation du Template</DialogTitle>
              </DialogHeader>
              <TemplatePreview template={editedTemplate} />
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Template Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Nom du template</Label>
              <Input
                id="template-name"
                value={editedTemplate.name}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-type">Type</Label>
              <Select
                value={editedTemplate.type}
                onValueChange={(value: "facture" | "devis") => 
                  setEditedTemplate(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facture">Facture</SelectItem>
                  <SelectItem value="devis">Devis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Content Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contenu du Template</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="template-content"
                value={editedTemplate.content}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu du template..."
                className="min-h-[500px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Variables Panel */}
        <div>
          <TemplateVariables onVariableClick={insertVariable} />
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
