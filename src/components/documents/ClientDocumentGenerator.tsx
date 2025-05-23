
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, FileUp, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";
import { useDocumentGeneration } from "@/hooks/useDocumentGeneration";
import TemplateSelectionList from "./TemplateSelectionList";
import TemplateVariableMapping from "@/components/documents/template-mapping/TemplateVariableMapping";
import { TemplateTag } from "@/types/documents"; 
import DocumentActions from "./DocumentActions";
import GenerationSuccess from "./GenerationSuccess";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [templateValid, setTemplateValid] = useState<boolean>(false);
  const { templates, loading, refreshTemplates } = useDocumentTemplates();
  const { generating, generated, documentId, handleGenerate, handleDownload, error, canDownload, reset } = useDocumentGeneration(onDocumentGenerated, clientName);
  const { toast } = useToast();

  // Get the selected template object
  const selectedTemplateObject = templates.find(t => t.id === selectedTemplate);

  // Vérifier si le template est valide
  const validateTemplate = useCallback((template: any) => {
    if (!template) {
      return false;
    }
    
    // Vérifier que le template a un contenu non vide
    if (!template.content || template.content.trim() === "") {
      return false;
    }
    
    // Si c'est un PDF, vérifier le format
    if (template.type === 'pdf') {
      return template.content.startsWith('data:application/pdf') || template.content.startsWith('blob:');
    }
    
    return true;
  }, []);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      toast({
        title: "Erreur",
        description: "Modèle introuvable",
        variant: "destructive"
      });
      return;
    }
    
    // Valider le template sélectionné
    const isValid = validateTemplate(template);
    setTemplateValid(isValid);
    
    if (!isValid) {
      toast({
        title: "Avertissement",
        description: "Le modèle sélectionné est vide ou contient un contenu invalide. La génération de document pourrait échouer.",
        variant: "default"
      });
    }
    
    setSelectedTemplate(templateId);
    setSelectedTab("mapping");
  };

  // Handle mapping completion
  const handleMappingComplete = useCallback((mappings: TemplateTag[]) => {
    setTemplateMappings(mappings);
    
    // Vérifier si toutes les variables sont mappées
    const unmappedCount = mappings.filter(m => !m.mappedTo || m.mappedTo === "").length;
    
    if (unmappedCount > 0) {
      toast({
        title: "Avertissement",
        description: `${unmappedCount} variables n'ont pas été mappées. La génération pourrait ne pas être optimale.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Mapping terminé",
        description: `${mappings.length} variables ont été mappées. Vous pouvez maintenant générer le document.`,
      });
    }
  }, [toast]);

  // Vérifier si le mapping est valide
  const validateMapping = (): {valid: boolean, message: string} => {
    if (!templateMappings || templateMappings.length === 0) {
      return {
        valid: false,
        message: "Aucune variable n'a été définie pour ce modèle"
      };
    }
    
    const unmappedTags = templateMappings.filter(tag => !tag.mappedTo || tag.mappedTo.trim() === '');
    
    if (unmappedTags.length > 0) {
      return {
        valid: false,
        message: `${unmappedTags.length} variable(s) n'ont pas été mappées`
      };
    }
    
    return { valid: true, message: "" };
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
    
    if (!templateValid) {
      toast({
        title: "Erreur",
        description: "Le modèle sélectionné est invalide ou vide. Impossible de générer un document.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Valider le mapping
      const validationResult = validateMapping();
      
      if (!validationResult.valid) {
        toast({
          title: "Erreur de mapping",
          description: validationResult.message,
          variant: "destructive"
        });
        return;
      }

      // Generate the document with mappings
      await handleGenerate(selectedTemplate, clientId, templateMappings);
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la génération du document: ${error instanceof Error ? error.message : String(error)}`,
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
        if (!generated) {
          setSelectedTab("templates");
          setSelectedTemplate("");
          setTemplateMappings([]);
        }
        reset(); // Reset the document generation state
      }, 300);
    }
  };

  // Rafraîchir les templates lorsque le dialogue s'ouvre
  const handleOpenDialog = () => {
    setIsOpen(true);
    refreshTemplates();
    reset(); // Reset any previous generation state
  };

  return (
    <>
      <Button onClick={handleOpenDialog}>
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

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {generated ? (
            <>
              <GenerationSuccess />
              <DialogFooter>
                <DocumentActions 
                  onDownload={handleDownload} 
                  documentId={documentId || undefined}
                  clientId={clientId}
                  canDownload={canDownload}
                />
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
                        disabled={!selectedTemplate || !templateValid}
                        onClick={() => {
                          if (!templateValid) {
                            toast({
                              title: "Avertissement",
                              description: "Le modèle sélectionné pourrait être vide ou invalide",
                              variant: "default"
                            });
                          }
                          setSelectedTab("mapping");
                        }}
                      >
                        Continuer →
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="mapping">
                  {selectedTemplateObject && (
                    <div className="space-y-4">
                      {!templateValid && (
                        <Alert variant="default" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Avertissement</AlertTitle>
                          <AlertDescription>
                            Le modèle sélectionné semble être vide ou contient un format invalide. 
                            La génération pourrait échouer ou produire un document vide.
                          </AlertDescription>
                        </Alert>
                      )}
                      
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
                          disabled={!templateValid || templateMappings.length === 0}
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
