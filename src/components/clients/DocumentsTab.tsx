
import { useRequiredDocuments } from "@/hooks/useRequiredDocuments";
import { DocumentsStats } from "./documents/DocumentsStats";
import { RequiredDocumentsList } from "./documents/RequiredDocumentsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const { requiredDocuments, documentStats, isLoading } = useRequiredDocuments(clientId);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  // Fonction pour gérer les actions sur les documents
  const handleDocumentAction = (documentId: string, action: string) => {
    const document = requiredDocuments.find(doc => doc.id === documentId);
    if (!document) return;

    switch (action) {
      case 'view':
        toast({
          title: "Visualisation du document",
          description: `Ouverture de ${document.name}`,
        });
        break;
      case 'download':
        toast({
          title: "Téléchargement",
          description: `Téléchargement de ${document.name} en cours...`,
        });
        break;
      case 'generate':
        toast({
          title: "Génération en cours",
          description: `Génération de ${document.name}...`,
        });
        break;
      default:
        break;
    }
  };

  // Fonction pour régénérer tous les documents
  const handleRegenerateAll = () => {
    setGenerating(true);
    
    toast({
      title: "Génération des documents",
      description: "Régénération de tous les documents en cours...",
    });
    
    // Simuler la génération (à remplacer par l'appel API réel)
    setTimeout(() => {
      setGenerating(false);
      toast({
        title: "Documents générés",
        description: "Tous les documents ont été régénérés avec succès.",
      });
    }, 2000);
  };

  // Fonction pour exporter tous les documents
  const handleExportAll = () => {
    toast({
      title: "Export en cours",
      description: "Préparation de l'export de tous les documents...",
    });
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents obligatoires</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Les 8 documents nécessaires pour compléter le dossier client
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportAll}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>Exporter tous</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRegenerateAll}
            disabled={generating}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Génération...' : 'Régénérer tous'}</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-3">
            <DocumentsStats 
              total={documentStats.total}
              generated={documentStats.generated}
              missing={documentStats.missing}
              error={documentStats.error}
            />
          </div>
          <div className="flex items-center justify-center bg-gray-50 rounded-md border p-4">
            <div className="text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-medium">
                {documentStats.generated}/{documentStats.total} Documents
              </div>
              <div className="text-sm text-gray-500">
                {documentStats.missing > 0 
                  ? `${documentStats.missing} documents manquants` 
                  : 'Tous les documents sont générés'}
              </div>
            </div>
          </div>
        </div>
        
        <RequiredDocumentsList 
          documents={requiredDocuments}
          isLoading={isLoading}
          onAction={handleDocumentAction}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
