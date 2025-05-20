
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, FileUp } from "lucide-react";
import { useState } from "react";
import { useDocumentGeneration } from "@/hooks/useDocumentGeneration";
import DocumentActions from "./DocumentActions";
import GenerationSuccess from "./GenerationSuccess";

interface GenerateDocumentButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  clientId?: string;
  clientName?: string;
  templateId?: string;
  onDocumentGenerated?: (documentId: string) => void;
}

const GenerateDocumentButton = ({
  variant = "default",
  size = "default",
  fullWidth = false,
  clientId,
  clientName,
  templateId,
  onDocumentGenerated,
}: GenerateDocumentButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    generating,
    generated,
    handleGenerate,
    handleDownload
  } = useDocumentGeneration(onDocumentGenerated, clientName);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${fullWidth ? "w-full" : ""}`}
        onClick={() => setIsModalOpen(true)}
      >
        <FileText className="mr-2 h-5 w-5" />
        Générer un document
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Génération de document</DialogTitle>
            <DialogDescription>
              {clientName
                ? `Créer un document pour le client ${clientName}`
                : "Créer un nouveau document à partir d'un modèle"}
            </DialogDescription>
          </DialogHeader>

          {generated ? (
            <>
              <GenerationSuccess />
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <DocumentActions onDownload={handleDownload} />
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="text-center">
                  {generating ? (
                    <div className="space-y-4">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="mt-2 font-medium">
                          Génération en cours...
                        </p>
                      </div>
                      <div className="h-2 bg-blue-100 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  ) : templateId ? (
                    <div className="p-4">
                      <p>Prêt à générer le document avec le modèle sélectionné</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <FileUp className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-sm text-gray-500 mb-2">
                        Sélectionnez un modèle dans la bibliothèque pour générer un document
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setIsModalOpen(false);
                          // Si cette fonction est disponible, changer d'onglet
                          const changeTab = (window as any).changeToLibraryTab;
                          if (typeof changeTab === 'function') {
                            changeTab();
                          }
                        }}
                      >
                        Parcourir les modèles
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={() => handleGenerate(templateId || 'default-template')}
                  disabled={generating || !templateId}
                >
                  Générer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateDocumentButton;
