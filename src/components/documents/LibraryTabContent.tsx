
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, FileUp } from "lucide-react";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { useTemplateActions } from "@/hooks/useTemplateActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface LibraryTabContentProps {
  loading: boolean;
  filteredTemplates: DocumentTemplate[];
  setActiveTab: (tab: string) => void;
}

const LibraryTabContent = ({ 
  loading, 
  filteredTemplates,
  setActiveTab 
}: LibraryTabContentProps) => {
  const {
    previewTemplate,
    showPreview,
    handlePreview,
    closePreview,
    handleUseTemplate
  } = useTemplateActions(setActiveTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bibliothèque de Documents</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="text-center py-8">Chargement des modèles...</div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
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
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Utiliser
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <h2 className="text-lg font-medium mb-2">Aucun modèle disponible</h2>
            <p className="text-gray-500 mb-4">
              Ajoutez des modèles pour pouvoir générer des documents.
            </p>
            <Button onClick={() => setActiveTab("templates")}>
              Ajouter un modèle
            </Button>
          </div>
        )}
      </CardContent>

      {/* Dialogue d'aperçu du modèle */}
      <Dialog open={showPreview} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {previewTemplate?.name} 
              <span className="text-xs ml-2 uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {previewTemplate?.type}
              </span>
            </DialogTitle>
            <DialogDescription>
              Ajouté le {previewTemplate?.dateUploaded}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative min-h-[300px] border rounded-md flex items-center justify-center">
            <div className="text-center">
              <FileUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aperçu du modèle "{previewTemplate?.name}"</p>
              <p className="text-sm text-gray-400 mt-2">
                L'aperçu des fichiers {previewTemplate?.type} n'est pas disponible directement dans l'application.
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between flex flex-col sm:flex-row gap-2">
            <div>
              <p className="text-sm text-gray-500">
                Type: {previewTemplate?.type.toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closePreview}>Fermer</Button>
              <Button onClick={() => {
                if (previewTemplate) {
                  handleUseTemplate(previewTemplate);
                  closePreview();
                }
              }}>Utiliser ce modèle</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LibraryTabContent;
