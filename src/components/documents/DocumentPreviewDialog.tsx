
import React from "react";
import { FileUp } from "lucide-react";
import { DocumentTemplate } from "@/types/documents"; // Import from central type definition
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface DocumentPreviewDialogProps {
  showPreview: boolean;
  closePreview: () => void;
  previewTemplate: DocumentTemplate | null;
  handleUseTemplate: (template: DocumentTemplate) => void;
}

const DocumentPreviewDialog = ({ 
  showPreview, 
  closePreview, 
  previewTemplate,
  handleUseTemplate 
}: DocumentPreviewDialogProps) => {
  return (
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
  );
};

export default DocumentPreviewDialog;
