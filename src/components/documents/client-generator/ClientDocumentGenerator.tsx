
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the new components
import GeneratorDialogHeader from "./GeneratorDialogHeader";
import TemplateSelectionStep from "./TemplateSelectionStep";
import MappingStep from "./MappingStep";
import GeneratingState from "./GeneratingState";
import SuccessState from "./SuccessState";
import { useDocumentGeneratorState } from "./useDocumentGeneratorState";

interface ClientDocumentGeneratorProps {
  clientId: string;
  clientName: string;
  onDocumentGenerated: (documentId: string) => void;
}

const ClientDocumentGenerator = ({
  clientId,
  clientName,
  onDocumentGenerated
}: ClientDocumentGeneratorProps) => {
  const {
    isOpen,
    setIsOpen,
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
    handleSaveToFolder
  } = useDocumentGeneratorState({
    clientId,
    clientName,
    onDocumentGenerated
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <FileText className="mr-2 h-5 w-5" />
        Générer un document
      </Button>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <GeneratorDialogHeader clientName={clientName} onClose={handleCloseDialog} />

          {generated ? (
            <SuccessState 
              onDownload={handleDownload} 
              onSaveToFolder={handleSaveToFolder}
              clientId={clientId}
              clientName={clientName}
              documentId={documentId}
            />
          ) : generating ? (
            <GeneratingState />
          ) : (
            <>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-4 grid grid-cols-2">
                  <TabsTrigger value="templates">1. Sélection du modèle</TabsTrigger>
                  <TabsTrigger value="mapping" disabled={!selectedTemplate}>
                    2. Mapping des variables
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="templates">
                  <TemplateSelectionStep 
                    selectedTemplate={selectedTemplate}
                    loading={loading}
                    templatesCount={templates.length}
                    onTemplateSelect={handleTemplateSelect}
                    onContinue={() => setSelectedTab("mapping")}
                  />
                </TabsContent>
                
                <TabsContent value="mapping">
                  {selectedTemplateObject && (
                    <MappingStep
                      template={selectedTemplateObject}
                      clientData={{}} // Passing empty object instead of undefined
                      onMappingComplete={handleMappingComplete}
                      onBack={() => setSelectedTab("templates")}
                      onGenerate={handleDocumentGeneration}
                      canGenerate={templateMappings.length > 0}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDocumentGenerator;
