import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

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

interface VisualEditorProps {
  template: Template;
  onTemplateChange: (template: Template) => void;
  onElementDrop: (elementType: string, position: { x: number; y: number }) => void;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  zoom: number;
}

const VisualEditor = ({ 
  template, 
  onTemplateChange, 
  onElementDrop, 
  selectedElement, 
  onElementSelect,
  zoom 
}: VisualEditorProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    onElementDrop(data.id, position);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onTemplateChange({
          ...template,
          logo: {
            url,
            position: 'top-left',
            size: 150
          },
          updated_at: new Date().toISOString().split('T')[0]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderElement = (element: TemplateElement) => {
    const isSelected = selectedElement === element.id;
    
    return (
      <div
        key={element.id}
        className={`absolute cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}
        style={{
          left: element.position.x,
          top: element.position.y,
          fontSize: element.style.fontSize,
          fontWeight: element.style.fontWeight,
          color: element.style.color,
          textAlign: element.style.textAlign as any,
          transform: `scale(${zoom / 100})`
        }}
        onClick={() => onElementSelect(element.id)}
      >
        {element.type === 'table' ? (
          <div className="border border-gray-300 bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Descripción</th>
                  <th className="border p-2">Cant</th>
                  <th className="border p-2">PU HT</th>
                  <th className="border p-2">Total HT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{"{{producto_nombre}}"}</td>
                  <td className="border p-2">{"{{superficie}}"} m²</td>
                  <td className="border p-2">{"{{precio_material}}"} €</td>
                  <td className="border p-2">{"{{total_material}}"} €</td>
                </tr>
                <tr>
                  <td className="border p-2">MANO DE OBRA</td>
                  <td className="border p-2">{"{{superficie}}"} m²</td>
                  <td className="border p-2">{"{{precio_mo}}"} €</td>
                  <td className="border p-2">{"{{total_mo}}"} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 min-w-16 min-h-6">
            {element.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full relative">
      {/* Logo Upload Zone */}
      {!template.logo && (
        <div className="absolute top-4 left-4 z-10">
          <Card className="p-4 border-dashed border-2 border-gray-300 bg-white/90">
            <label className="cursor-pointer flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Glissez un logo ou cliquez</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </label>
          </Card>
        </div>
      )}

      {/* Logo Display */}
      {template.logo && (
        <div 
          className="absolute z-10 cursor-pointer"
          style={{
            top: template.logo.position === 'top-center' ? '20px' : '20px',
            left: template.logo.position === 'top-left' ? '20px' : 
                  template.logo.position === 'top-center' ? '50%' : 'auto',
            right: template.logo.position === 'top-right' ? '20px' : 'auto',
            transform: template.logo.position === 'top-center' ? 'translateX(-50%)' : 'none'
          }}
        >
          <img 
            src={template.logo.url} 
            alt="Logo" 
            style={{ 
              width: template.logo.size,
              height: 'auto',
              transform: `scale(${zoom / 100})`
            }}
          />
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`w-full h-full min-h-[800px] bg-white shadow-lg mx-auto relative ${
          dragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
        }`}
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => onElementSelect(null)}
      >
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/80 z-20">
            <div className="text-blue-600 text-lg font-medium">
              Relâchez pour ajouter l'élément
            </div>
          </div>
        )}

        {/* Rendered Elements */}
        {template.layout?.elements?.map(renderElement)}

        {/* Default Content if no elements */}
        {(!template.layout?.elements || template.layout.elements.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-2">📄</div>
              <div>Glissez des éléments ici pour construire votre template</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualEditor;
