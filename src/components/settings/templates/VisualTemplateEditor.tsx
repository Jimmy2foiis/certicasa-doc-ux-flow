
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, ArrowLeft, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DraggableElementsPanel from "./visual-editor/DraggableElementsPanel";
import VisualEditor from "./visual-editor/VisualEditor";
import LivePDFPreview from "./visual-editor/LivePDFPreview";
import FloatingToolbar from "./visual-editor/FloatingToolbar";

interface TemplateElement {
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
}

interface TemplateLayout {
  elements: TemplateElement[];
  styles: {
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    margins: { top: number; right: number; bottom: number; left: number };
  };
}

interface Template {
  id: string;
  name: string;
  type: "facture" | "devis";
  content: string;
  layout: TemplateLayout;
  logo?: {
    url: string;
    position: 'top-left' | 'top-center' | 'top-right';
    size: number;
  };
  created_at: string;
  updated_at: string;
}

interface VisualTemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

const VisualTemplateEditor = ({ template, onSave, onCancel }: VisualTemplateEditorProps) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(template);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();

  // Auto-save functionality
  const saveTemplate = useCallback(async (templateToSave: Template) => {
    setIsSaving(true);
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
      onSave(templateToSave);
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le template",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [onSave, toast]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentTemplate.id) {
        saveTemplate(currentTemplate);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentTemplate, saveTemplate]);

  const handleElementDrop = (elementType: string, position: { x: number; y: number }) => {
    const newElement: TemplateElement = {
      id: `element_${Date.now()}`,
      type: elementType as any,
      content: getDefaultContent(elementType),
      position,
      style: getDefaultStyle()
    };

    setCurrentTemplate(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        elements: [...prev.layout.elements, newElement]
      }
    }));
  };

  const getDefaultContent = (elementType: string): string => {
    switch (elementType) {
      case 'cliente_nombre': return '{{cliente_nombre}}';
      case 'cliente_nif': return '{{cliente_nif}}';
      case 'cliente_direccion': return '{{cliente_direccion}}';
      case 'numero_factura': return 'FACTURA {{numero_factura}}';
      case 'fecha_hoy': return 'Fecha: {{fecha_hoy}}';
      case 'tabla_facturacion': return '[TABLE_FACTURACION]';
      case 'mentions_paiement': return 'Paiement à 30 jours';
      case 'mentions_legales': return 'TVA non applicable, art. 293 B du CGI';
      default: return elementType;
    }
  };

  const getDefaultStyle = () => ({
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left'
  });

  const handleTemplateChange = (updatedTemplate: Template) => {
    setCurrentTemplate(updatedTemplate);
  };

  const handleSave = () => {
    saveTemplate(currentTemplate);
    toast({
      title: "Template sauvegardé",
      description: "Votre template a été sauvegardé avec succès"
    });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="text-xl font-bold">Éditeur Visuel - {currentTemplate.name}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {isSaving && <span>💾 Sauvegarde...</span>}
              {lastSaved && <span>✅ Sauvegardé à {lastSaved}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoom}%</span>
          <Button variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Draggable Elements */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <DraggableElementsPanel />
        </div>

        {/* Column 2: Visual Editor */}
        <div className="flex-1 bg-gray-100 overflow-auto relative">
          <VisualEditor
            template={currentTemplate}
            onTemplateChange={handleTemplateChange}
            onElementDrop={handleElementDrop}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            zoom={zoom}
          />
          {selectedElement && (
            <FloatingToolbar
              elementId={selectedElement}
              template={currentTemplate}
              onTemplateChange={handleTemplateChange}
            />
          )}
        </div>

        {/* Column 3: Live PDF Preview */}
        <div className="w-96 bg-white border-l">
          <LivePDFPreview
            template={currentTemplate}
            zoom={zoom}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualTemplateEditor;
