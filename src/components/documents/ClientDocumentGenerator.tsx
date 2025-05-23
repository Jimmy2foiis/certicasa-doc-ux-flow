
import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";
import { useDocumentGenerationState } from "@/hooks/useDocumentGenerationState";
import { GeneratorDialogHeader } from "./generator/GeneratorDialogHeader";
import { GeneratorErrorDisplay } from "./generator/GeneratorErrorDisplay";
import { GeneratorLoadingState } from "./generator/GeneratorLoadingState";
import { GeneratedDocumentContent } from "./generator/GeneratedDocumentContent";
import { TemplateTabContent } from "./generator/TemplateTabContent";
import { MappingTabContent } from "./generator/MappingTabContent";
import { GeneratorTriggerButton } from "./generator/GeneratorTriggerButton";

interface ClientDocumentGeneratorProps {
  clientId: string;
  clientName: string;
  clientData: any;
  onDocumentGenerated: (documentId: string) => void;
}

const ClientDocumentGenerator = ({
  clientId,
  clientName,
  clientData,
  onDocumentGenerated
}: ClientDocumentGeneratorProps) => {
  const { templates, loading, refreshTemplates } = useDocumentTemplates();
  const {
    isOpen, 
    setIsOpen,
    selectedTab,
    setSelectedTab,
    selectedTemplate,
    templateMappings,
    templateValid,
    generating,
    generated,
    documentId,
    error,
    canDownload,
    handleTemplateSelect,
    handleMappingComplete,
    handleDocumentGeneration,
    handleDownload,
    handleCloseDialog,
    handleOpenDialog
  } = useDocumentGenerationState({
    clientId,
    clientName,
    onDocumentGenerated
  });

  // Get the selected template object
  const selectedTemplateObject = templates.find(t => t.id === selectedTemplate);

  // Refresh templates when dialog opens
  useEffect(() => {
    if (isOpen) {
      refreshTemplates();
    }
  }, [isOpen, refreshTemplates]);

  return (
    <>
      <GeneratorTriggerButton onClick={handleOpenDialog} />

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <GeneratorDialogHeader 
            clientName={clientName} 
            onClose={handleCloseDialog} 
          />

          <GeneratorErrorDisplay error={error} />

          {generated ? (
            <GeneratedDocumentContent
              documentId={documentId}
              clientId={clientId}
              canDownload={canDownload}
              onDownload={handleDownload}
            />
          ) : generating ? (
            <GeneratorLoadingState />
          ) : (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4 grid grid-cols-2">
                <TabsTrigger value="templates">1. Sélection du modèle</TabsTrigger>
                <TabsTrigger value="mapping" disabled={!selectedTemplate}>
                  2. Mapping des variables
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates">
                <TemplateTabContent
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={(templateId) => handleTemplateSelect(templateId, templates)}
                  onContinue={() => setSelectedTab("mapping")}
                  templates={templates}
                  loading={loading}
                  templateValid={templateValid}
                />
              </TabsContent>
              
              <TabsContent value="mapping">
                <MappingTabContent
                  template={selectedTemplateObject}
                  clientData={clientData}
                  onMappingComplete={handleMappingComplete}
                  onBack={() => setSelectedTab("templates")}
                  onGenerate={handleDocumentGeneration}
                  templateValid={templateValid}
                  templateMappings={templateMappings}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDocumentGenerator;
