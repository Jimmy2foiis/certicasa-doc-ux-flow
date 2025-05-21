
import React from "react";
import { FileText, Eye, Trash2 } from "lucide-react";
import { DocumentTemplate } from "@/types/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentTemplateCardProps {
  template: DocumentTemplate;
  handlePreview: (template: DocumentTemplate) => void;
  confirmDelete: (templateId: string) => void;
  handleUseTemplate: (template: DocumentTemplate) => void;
}

const DocumentTemplateCard = ({
  template,
  handlePreview,
  confirmDelete,
  handleUseTemplate
}: DocumentTemplateCardProps) => {
  return (
    <Card key={template.id} className="overflow-hidden">
      <CardContent className="p-4 flex items-start space-x-4">
        <div className={`p-3 rounded-full ${template.type === 'docx' ? 'bg-blue-100' : 'bg-red-100'}`}>
          <FileText className={`h-6 w-6 ${template.type === 'docx' ? 'text-blue-600' : 'text-red-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{template.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Ajouté le {template.dateUploaded}</span>
            <span className="text-xs uppercase px-2 py-1 rounded-full bg-gray-100 text-gray-700">{template.type}</span>
          </div>
        </div>
      </CardContent>
      <div className="border-t px-4 py-3 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handlePreview(template)}
        >
          <Eye className="h-4 w-4 mr-1" /> Aperçu
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => confirmDelete(template.id)}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
        </Button>
        <Button 
          size="sm"
          onClick={() => handleUseTemplate(template)}
        >
          Utiliser
        </Button>
      </div>
    </Card>
  );
};

export default DocumentTemplateCard;
