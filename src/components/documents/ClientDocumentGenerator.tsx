
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, FileUp, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";
import { useDocumentGeneration } from "@/hooks/useDocumentGeneration";
import TemplateSelectionList from "./TemplateSelectionList";
import TemplateVariableMapping from "@/components/documents/template-mapping/TemplateVariableMapping";
import { TemplateTag } from "@/components/documents/template-mapping/types"; 
import DocumentActions from "./DocumentActions";
import GenerationSuccess from "./GenerationSuccess";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateMappings, setTemplateMappings] = useState<TemplateTag[]>([]);
  const { templates, loading } = useDocumentTemplates();
  const { generating, generated, documentId, handleGenerate, handleDownload } = useDocumentGeneration(onDocumentGenerated, clientName);
  const { toast } = useToast();

  // Get the selected template object
  const selectedTemplateObject = templates.find(t => t.id === selectedTemplate);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setSelectedTab("mapping");
  };

  // Handle mapping completion
  const handleMappingComplete = (mappings: TemplateTag[]) => {
    setTemplateMappings(mappings);
    toast({
      title: "Mapping terminé",
      description: "Vous pouvez maintenant procéder à la génération du document."
    });
  };

  // Handle document generation
  const handleDocumentGeneration = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle de document.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate the document with mappings
      await handleGenerate(selectedTemplate, clientId, templateMappings);
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du document.",
        variant: "destructive"
      });
    }
  };

  // Reset the state when dialog is closed
  const handleCloseDialog = () => {
    if (!generating) {
      setIsOpen(false);
      // Wait for dialog animation to finish before resetting state
      setTimeout(() => {
        if (generated) {
          // Don't reset the template selection if successful
          setSelectedTab("templates");
        }
      }, 300);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <FileText className="mr-2 h-5 w-5" />
        Générer un document
      </Button>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Génération de document pour {clientName}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCloseDialog}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Sélectionnez un modèle et mappez les variables pour générer un document personnalisé
            </DialogDescription>
          </DialogHeader>

          {generated ? (
            <>
              <GenerationSuccess />
              <DialogFooter>
                <DocumentActions onDownload={handleDownload} />
              </DialogFooter>
            </>
          ) : generating ? (
            <div className="py-8 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <p className="mt-4 font-medium">
                  Génération du document en cours...
                </p>
              </div>
              <div className="mt-4 h-2 bg-blue-100 rounded overflow-hidden">
                <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
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
                  <div className="space-y-4">
                    <TemplateSelectionList
                      selectedTemplate={selectedTemplate}
                      onTemplateSelect={handleTemplateSelect}
                    />
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {loading ? "Chargement des modèles..." : `${templates.length} modèle(s) disponible(s)`}
                      </p>
                      <Button
                        variant="secondary"
                        disabled={!selectedTemplate}
                        onClick={() => setSelectedTab("mapping")}
                      >
                        Continuer →
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="mapping">
                  {selectedTemplateObject && (
                    <div className="space-y-4">
                      <TemplateVariableMapping
                        template={selectedTemplateObject}
                        clientData={clientData}
                        onMappingComplete={handleMappingComplete}
                      />
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedTab("templates")}
                        >
                          ← Retour
                        </Button>
                        <Button
                          disabled={templateMappings.length === 0}
                          onClick={handleDocumentGeneration}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Générer le document
                        </Button>
                      </div>
                    </div>
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
