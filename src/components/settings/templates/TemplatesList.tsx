
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  type: "facture" | "devis";
  content: string;
  created_at: string;
  updated_at: string;
}

interface TemplatesListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onDuplicate: (template: Template) => void;
}

const TemplatesList = ({ templates, onEdit, onDelete, onDuplicate }: TemplatesListProps) => {
  const { toast } = useToast();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "facture":
        return "bg-blue-100 text-blue-800";
      case "devis":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template_${template.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template exporté",
      description: "Le template a été exporté avec succès."
    });
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📄</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template</h3>
        <p className="text-gray-600 mb-4">Créez votre premier template de facture pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <Badge className={getTypeColor(template.type)}>
                {template.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <div>Créé le: {new Date(template.created_at).toLocaleDateString('fr-FR')}</div>
              <div>Modifié le: {new Date(template.updated_at).toLocaleDateString('fr-FR')}</div>
            </div>
            
            <div className="text-sm text-gray-700">
              <div className="font-medium mb-1">Aperçu du contenu:</div>
              <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-20 overflow-hidden">
                {template.content.substring(0, 100)}...
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(template)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Éditer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(template)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport(template)}
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(template.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplatesList;
