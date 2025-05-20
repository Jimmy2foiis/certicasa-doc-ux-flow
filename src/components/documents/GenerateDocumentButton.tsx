
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

// Mock document templates - in a real app, this would come from a database
const documentTemplates = [
  { id: "1", name: "Devis standard", type: "docx", lastModified: "12/05/2025" },
  { id: "2", name: "Facture", type: "pdf", lastModified: "10/05/2025" },
  { id: "3", name: "Contrat client", type: "docx", lastModified: "11/05/2025" },
  { id: "4", name: "Certificat d'achèvement", type: "docx", lastModified: "09/05/2025" },
  { id: "5", name: "Fiche technique", type: "pdf", lastModified: "08/05/2025" },
  { id: "6", name: "Rapport d'inspection", type: "pdf", lastModified: "05/05/2025" },
  { id: "7", name: "Proposition technique", type: "docx", lastModified: "06/05/2025" },
];

interface GenerateDocumentButtonProps {
  clientId?: string;
  clientName?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'outline';
}

const GenerateDocumentButton = ({ 
  clientId, 
  clientName = "Client",
  fullWidth = false,
  variant = 'default'
}: GenerateDocumentButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState(documentTemplates);
  const { toast } = useToast();

  // Filter templates based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = documentTemplates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        template.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTemplates(filtered);
    } else {
      setTemplates(documentTemplates);
    }
  }, [searchTerm]);

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
      
      toast({
        title: "Document généré avec succès",
        description: "Le document a été généré et ajouté au dossier du client.",
      });
      
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

  const refreshTemplates = () => {
    toast({
      title: "Actualisation",
      description: "Liste des modèles actualisée."
    });
    // In a real app, this would fetch fresh templates from the server
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
            {clientName ? `Choisissez un modèle pour ${clientName}` : "Choisissez un modèle de document à générer"}
          </DialogDescription>
        </DialogHeader>
        
        {generated ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-lg mb-1">Document généré avec succès !</h3>
            <p className="text-center text-gray-500 mb-4">
              Le document a été généré et ajouté au dossier du client.
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
                  onClick={refreshTemplates}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="h-72 rounded-md border">
                {templates.length > 0 ? (
                  <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="p-1">
                    {templates.map((template) => (
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
                              <p className="text-xs text-gray-500">Modifié le {template.lastModified}</p>
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
                    <p className="text-gray-500 mb-2">Aucun modèle ne correspond à votre recherche.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSearchTerm("")}
                    >
                      Effacer la recherche
                    </Button>
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
