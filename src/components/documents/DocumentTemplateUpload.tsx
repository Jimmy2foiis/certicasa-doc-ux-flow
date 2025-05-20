
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import TemplateUploadArea from "./TemplateUploadArea";
import TemplateFileItem from "./TemplateFileItem";
import { useDocumentTemplateUpload } from "@/hooks/useDocumentTemplateUpload";

// Clé de référence pour les modèles de documents (maintenu pour compatibilité)
export const DOCUMENT_TEMPLATES_KEY = 'document_templates';

const DocumentTemplateUpload = () => {
  const {
    uploadedFiles,
    uploading,
    fileToDelete,
    handleFileUpload,
    confirmDeleteFile,
    handleDeleteFile,
    cancelDelete,
    saveAllTemplates
  } = useDocumentTemplateUpload();
  
  // Pour le débogage
  useEffect(() => {
    console.log("État actuel des fichiers téléversés:", uploadedFiles);
  }, [uploadedFiles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Téléverser des modèles</CardTitle>
        <CardDescription>
          Téléversez des modèles Word (.docx) ou PDF interactifs pour la génération de documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <TemplateUploadArea 
            uploading={uploading} 
            onChange={handleFileUpload} 
          />

          {uploadedFiles.length > 0 && (
            <ScrollArea className="h-[250px] rounded">
              <div className="space-y-3 pr-3">
                <h3 className="text-sm font-medium mb-2">Fichiers téléversés</h3>
                {uploadedFiles.map((file) => (
                  <TemplateFileItem
                    key={file.id}
                    file={file}
                    onDelete={confirmDeleteFile}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <AlertDialog open={!!fileToDelete} onOpenChange={cancelDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le modèle</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce modèle ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteFile}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
      
      {uploadedFiles.length > 0 && (
        <CardFooter>
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {uploadedFiles.length} modèle(s) téléversé(s)
            </p>
            <Button 
              onClick={() => {
                console.log("Tentative de sauvegarde des modèles:", uploadedFiles);
                saveAllTemplates(uploadedFiles);
              }}
            >
              Enregistrer dans la bibliothèque
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentTemplateUpload;
