
import { useState, useEffect } from "react";
import { FileText, Download, Mail, Save, Check, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";

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
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { templates, loading, refreshTemplates } = useDocumentTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const { toast } = useToast();

  // Filter templates based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        template.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchTerm, templates]);

  const handleGenerate = () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle de document.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    // Simuler le temps de génération
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      
      // Générer un ID de document
      const documentId = `doc-${Date.now()}`;
      
      toast({
        title: "Document généré avec succès",
        description: clientId 
          ? `Le document a été généré et ajouté au dossier du client ${clientName}.`
          : "Le document a été généré avec succès.",
      });
      
      // Notifier le parent si nécessaire
      if (onDocumentGenerated) {
        onDocumentGenerated(documentId);
      }
      
      // Reset après quelques secondes
      setTimeout(() => {
        setGenerated(false);
        setOpen(false);
        setSelectedTemplate("");
        setSearchTerm("");
      }, 2000);
    }, 1500);
  };

  const handleDownload = () => {
    toast({
      title: "Téléchargement commencé",
      description: "Le document est en cours de téléchargement."
    });
  };

  // Manuellement rafraîchir les templates
  const handleRefreshTemplates = () => {
    refreshTemplates();
    toast({
      title: "Actualisation",
      description: "Liste des modèles actualisée."
    });
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
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-lg mb-1">Document généré avec succès !</h3>
            <p className="text-center text-gray-500 mb-4">
              {clientId 
                ? `Le document a été généré et ajouté au dossier de ${clientName}.`
                : "Le document a été généré avec succès."}
            </p>
          </div>
        ) : (
          <>
            <div className="pb-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un modèle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleRefreshTemplates}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="h-72 rounded-md border">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Chargement des modèles...</p>
                  </div>
                ) : filteredTemplates.length > 0 ? (
                  <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="p-1">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                          selectedTemplate === template.id ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <RadioGroupItem value={template.id} id={`template-${template.id}`} />
                        <Label
                          htmlFor={`template-${template.id}`}
                          className="flex flex-1 items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center">
                            <FileText className={`h-5 w-5 mr-3 ${template.type === 'docx' ? 'text-blue-500' : 'text-red-500'}`} />
                            <div>
                              <p className="font-medium">{template.name}</p>
                              <p className="text-xs text-gray-500">Ajouté le {template.dateUploaded}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="uppercase"
                          >
                            {template.type}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <p className="text-gray-500 mb-2">
                      {searchTerm 
                        ? "Aucun modèle ne correspond à votre recherche."
                        : "Aucun modèle n'est disponible. Veuillez téléverser des modèles dans la bibliothèque."
                      }
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSearchTerm("")}
                      >
                        Effacer la recherche
                      </Button>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>

            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="default"
                  className="flex-1"
                  disabled={!selectedTemplate || generating}
                  onClick={handleGenerate}
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
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par email
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer dans le dossier
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDocumentButton;
