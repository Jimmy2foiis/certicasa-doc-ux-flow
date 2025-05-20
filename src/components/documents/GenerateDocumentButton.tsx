
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import TemplateSelectionList from "./TemplateSelectionList";
import GenerationSuccess from "./GenerationSuccess";
import DocumentActions from "./DocumentActions";
import { useDocumentGeneration } from "@/hooks/useDocumentGeneration";

interface GenerateDocumentButtonProps {
  clientId?: string;
  clientName?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'outline';
  onDocumentGenerated?: (documentId: string) => void;
}

const GenerateDocumentButton = ({ 
  clientId, 
  clientName = "Client",
  fullWidth = false,
  variant = 'default',
  onDocumentGenerated
}: GenerateDocumentButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  const {
    generating,
    generated,
    setGenerated,
    handleGenerate,
    handleDownload
  } = useDocumentGeneration(onDocumentGenerated, clientName);
  
  const closeDialog = () => {
    setOpen(false);
    // Reset form state after dialog is closed
    setTimeout(() => {
      setSelectedTemplate("");
      setGenerated(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={fullWidth ? "w-full" : ""}>
          <FileText className="mr-2 h-4 w-4" />
          Générer un document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Générer un document</DialogTitle>
          <DialogDescription>
            {clientId 
              ? `Choisissez un modèle pour ${clientName}` 
              : "Choisissez un modèle de document à générer"}
          </DialogDescription>
        </DialogHeader>
        
        {generated ? (
          <GenerationSuccess clientId={clientId} clientName={clientName} />
        ) : (
          <>
            <TemplateSelectionList 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />

            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
              <Button
                variant="outline"
                onClick={closeDialog}
              >
                Annuler
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="default"
                  className="flex-1"
                  disabled={!selectedTemplate || generating}
                  onClick={() => handleGenerate(selectedTemplate)}
                >
                  {generating ? (
                    <>
                      <span className="animate-spin mr-2">&#9696;</span>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Générer
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}

        {generated && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DocumentActions onDownload={handleDownload} />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDocumentButton;
