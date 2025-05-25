
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Trash2 } from "lucide-react";

interface Template {
  layout: {
    elements: Array<{
      id: string;
      style: {
        fontSize: number;
        fontWeight: string;
        color: string;
        textAlign: string;
      };
    }>;
  };
}

interface FloatingToolbarProps {
  elementId: string;
  template: Template;
  onTemplateChange: (template: Template) => void;
}

const FloatingToolbar = ({ elementId, template, onTemplateChange }: FloatingToolbarProps) => {
  const element = template.layout?.elements?.find(el => el.id === elementId);
  
  if (!element) return null;

  const updateElementStyle = (styleUpdates: Partial<typeof element.style>) => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        elements: template.layout.elements.map(el =>
          el.id === elementId
            ? { ...el, style: { ...el.style, ...styleUpdates } }
            : el
        )
      }
    };
    onTemplateChange(updatedTemplate);
  };

  const deleteElement = () => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        elements: template.layout.elements.filter(el => el.id !== elementId)
      }
    };
    onTemplateChange(updatedTemplate);
  };

  const toggleBold = () => {
    updateElementStyle({
      fontWeight: element.style.fontWeight === 'bold' ? 'normal' : 'bold'
    });
  };

  const setAlignment = (alignment: string) => {
    updateElementStyle({ textAlign: alignment });
  };

  const setFontSize = (fontSize: string) => {
    updateElementStyle({ fontSize: parseInt(fontSize) });
  };

  const setColor = (color: string) => {
    updateElementStyle({ color });
  };

  return (
    <Card className="absolute top-4 right-4 p-2 shadow-lg z-50 bg-white">
      <div className="flex items-center space-x-2">
        {/* Font Size */}
        <Select value={element.style.fontSize.toString()} onValueChange={setFontSize}>
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="24">24</SelectItem>
          </SelectContent>
        </Select>

        {/* Bold */}
        <Button
          variant={element.style.fontWeight === 'bold' ? 'default' : 'outline'}
          size="sm"
          onClick={toggleBold}
        >
          <Bold className="h-3 w-3" />
        </Button>

        {/* Alignment */}
        <Button
          variant={element.style.textAlign === 'left' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAlignment('left')}
        >
          <AlignLeft className="h-3 w-3" />
        </Button>
        <Button
          variant={element.style.textAlign === 'center' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAlignment('center')}
        >
          <AlignCenter className="h-3 w-3" />
        </Button>
        <Button
          variant={element.style.textAlign === 'right' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAlignment('right')}
        >
          <AlignRight className="h-3 w-3" />
        </Button>

        {/* Color Picker */}
        <input
          type="color"
          value={element.style.color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
        />

        {/* Delete */}
        <Button
          variant="outline"
          size="sm"
          onClick={deleteElement}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};

export default FloatingToolbar;
