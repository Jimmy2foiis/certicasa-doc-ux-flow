
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { TemplateTag } from "../template-mapping/types";
import { useDocumentGeneratorState } from "./useDocumentGeneratorState";
import TemplateSelectionStep from "./TemplateSelectionStep";
import MappingStep from "./MappingStep";
import { NotFoundTemplate } from "../template-mapping/NotFoundTemplate";
import GeneratingState from "./GeneratingState";
import SuccessState from "./SuccessState";
import GeneratorDialogHeader from "./GeneratorDialogHeader";

interface DocumentGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onDocumentGenerated?: (documentId: string) => void;
}

const DocumentGeneratorDialog = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  onDocumentGenerated,
}: DocumentGeneratorDialogProps) => {
  const {
    selectedTab,
    setSelectedTab,
    selectedTemplate,
    selectedTemplateObject,
    templateMappings,
    templates,
    loading,
    generating,
    generated,
    documentId,
    handleTemplateSelect,
    handleMappingComplete,
    handleDocumentGeneration,
    handleCloseDialog,
    handleDownload,
    handleSaveToFolder,
  } = useDocumentGeneratorState({
    clientId,
    clientName,
    onDocumentGenerated: onDocumentGenerated || (() => {}),
  });

  // Client data for mapping, to be fetched based on clientId
  const [clientData, setClientData] = useState<any>({});

  useEffect(() => {
    // Reset dialog state when it's opened
    if (isOpen) {
      setSelectedTab("templates");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleCloseDialog();
      onClose();
    }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Génération de document pour {clientName}</DialogTitle>
          <DialogDescription>
            Sélectionnez un modèle et mappez les variables pour générer un document personnalisé
          </DialogDescription>
        </DialogHeader>

        {!generating && !generated && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div
              className={`py-2 px-4 rounded-md text-center cursor-pointer ${
                selectedTab === "templates"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "bg-gray-50 text-gray-500"
              }`}
              onClick={() => setSelectedTab("templates")}
            >
              1. Sélection du modèle
            </div>
            <div
              className={`py-2 px-4 rounded-md text-center cursor-pointer ${
                selectedTab === "mapping"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "bg-gray-50 text-gray-500"
              }`}
              onClick={() => {
                if (selectedTemplate) setSelectedTab("mapping");
              }}
            >
              2. Mapping des variables
            </div>
          </div>
        )}

        {generating && !generated && <GeneratingState />}
        
        {!generating && generated && (
          <SuccessState
            documentId={documentId}
            onDownload={handleDownload}
            onSaveToFolder={handleSaveToFolder}
          />
        )}
        
        {!generating && !generated && selectedTab === "templates" && (
          <TemplateSelectionStep
            selectedTemplate={selectedTemplate}
            loading={loading}
            templatesCount={templates.length}
            onTemplateSelect={handleTemplateSelect}
            onContinue={() => setSelectedTab("mapping")}
          />
        )}
        
        {!generating && !generated && selectedTab === "mapping" && selectedTemplateObject && (
          <MappingStep
            template={selectedTemplateObject}
            clientData={clientData}
            onMappingComplete={handleMappingComplete}
            onBack={() => setSelectedTab("templates")}
            onGenerate={handleDocumentGeneration}
            canGenerate={templateMappings.length > 0}
          />
        )}
        
        {!generating && !generated && selectedTab === "mapping" && !selectedTemplateObject && (
          <NotFoundTemplate />
        )}

        {!generating && !generated && (
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            
            {selectedTab === "mapping" && (
              <Button onClick={handleDocumentGeneration} disabled={generating}>
                Générer le document
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGeneratorDialog;
