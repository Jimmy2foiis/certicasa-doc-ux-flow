
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

import GeneratorDialogHeader from "./GeneratorDialogHeader";
import TemplateSelectionStep from "./TemplateSelectionStep";
import MappingStep from "./MappingStep";
import GeneratingState from "./GeneratingState";
import SuccessState from "./SuccessState";
import { useDocumentGeneration } from "@/hooks/useDocumentGeneration";
import { DocumentTemplate } from "@/hooks/useDocumentTemplates";
import { TemplateTag } from "@/components/documents/template-mapping/types";
import { NotFoundTemplate } from "@/components/documents/template-mapping/NotFoundTemplate";
import { TemplateValidationState } from "@/types/documents";

type Step = "selection" | "mapping" | "generating" | "success";

interface DocumentGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName?: string;
  onDocumentGenerated?: (documentId: string) => void;
}

const DocumentGeneratorDialog: React.FC<DocumentGeneratorDialogProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName = "Client",
  onDocumentGenerated = () => {},
}) => {
  const [step, setStep] = useState<Step>("selection");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]);
  const [validationState, setValidationState] = useState<TemplateValidationState | null>(null);
  
  const {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload
  } = useDocumentGeneration((docId) => {
    onDocumentGenerated(docId);
    setStep("success");
  }, clientName, clientId);

  // Réinitialiser l'état lorsque le dialogue se ferme
  useEffect(() => {
    if (!isOpen) {
      // Réinitialiser l'état après fermeture du dialogue
      setTimeout(() => {
        setStep("selection");
        setSelectedTemplate(null);
        setTemplateTags([]);
        setValidationState(null);
      }, 300);
    }
  }, [isOpen]);

  // Gérer la transition vers l'étape de mapping
  const handleTemplateSelect = (template: DocumentTemplate, tags: TemplateTag[], validState: TemplateValidationState | null) => {
    setSelectedTemplate(template);
    setTemplateTags(tags);
    setValidationState(validState);
    
    if (validState) {
      // Si un état d'invalidation est présent, rester sur la même étape
      setStep("selection");
    } else {
      // Sinon, passer à l'étape de mapping
      setStep("mapping");
    }
  };

  // Gérer la génération du document avec les mappings
  const handleGenerateWithMappings = (mappings: TemplateTag[]) => {
    if (!selectedTemplate) return;
    
    setStep("generating");
    handleGenerate(selectedTemplate.id, clientId, mappings);
  };

  const renderContent = () => {
    switch (step) {
      case "selection":
        if (validationState) {
          return <NotFoundTemplate reason={validationState} />;
        }
        return (
          <TemplateSelectionStep
            clientId={clientId}
            onTemplateSelect={handleTemplateSelect}
          />
        );
      case "mapping":
        return (
          <MappingStep
            templateTags={templateTags}
            clientId={clientId}
            onGenerate={handleGenerateWithMappings}
            onBack={() => setStep("selection")}
          />
        );
      case "generating":
        return <GeneratingState />;
      case "success":
        return (
          <SuccessState
            documentId={documentId}
            clientId={clientId}
            onDownload={handleDownload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <GeneratorDialogHeader
            step={step}
            clientName={clientName}
            templateName={selectedTemplate?.name}
          />
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGeneratorDialog;
