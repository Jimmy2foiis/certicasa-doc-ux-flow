
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, FileUp, Trash2, RefreshCw } from "lucide-react";
import { DocumentTemplate, useDocumentTemplates } from "@/hooks/useDocumentTemplates";
import { useTemplateActions } from "@/hooks/useTemplateActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { removeTemplate, forceRefresh } = useDocumentTemplates();
  const [templateToDelete, setTemplateToDelete] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  const {
    previewTemplate,
    showPreview,
    handlePreview,
    closePreview,
    handleUseTemplate
  } = useTemplateActions(setActiveTab);

  // Fonction pour confirmer la suppression
  const confirmDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
  };

  // Fonction pour effectuer la suppression
  const handleDelete = () => {
    if (templateToDelete) {
      removeTemplate(templateToDelete);
      setTemplateToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setTemplateToDelete(null);
  };

  // Fonction pour rafraîchir la liste des modèles
  const handleRefresh = () => {
    setIsRefreshing(true);
    forceRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Affichage des états de chargement avec des squelettes
  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="mt-4 border-t pt-3 flex justify-end gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bibliothèque de Documents</CardTitle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={isRefreshing ? 'animate-spin' : ''}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {loading || isRefreshing ? (
          renderLoadingState()
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

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={!!templateToDelete} onOpenChange={() => templateToDelete ? cancelDelete() : null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce modèle de document ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default LibraryTabContent;
