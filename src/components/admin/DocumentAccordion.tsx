
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  MoreHorizontal, 
  RefreshCw, 
  FileBadge, 
  Settings 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample document types
const documentTypes = [
  { id: "1", name: "Ficha", status: "generated", description: "Fiche d'information client" },
  { id: "2", name: "Anexo I", status: "ready", description: "Annexe contractuelle" },
  { id: "3", name: "Facture", status: "missing", description: "Facture des travaux" },
  { id: "4", name: "4-Fotos", status: "ready", description: "Photos des travaux" },
  { id: "5", name: "Certificado Instalador + Calcul Coef", status: "error", description: "Certificat d'installation" },
  { id: "6", name: "CEEE Inicial & Final", status: "pending", description: "Certificat d'économie d'énergie" },
  { id: "7", name: "Modelo Cesión Ahorros", status: "generated", description: "Modèle de cession des économies" },
  { id: "8", name: "DNI Client", status: "generated", description: "Document d'identité client" }
];

const DocumentAccordion = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Généré</Badge>;
      case "ready":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Prêt à générer</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En attente données</Badge>;
      case "missing":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Manquant</Badge>;
      case "error":
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Get document actions
  const getActionButtons = (docId: string, status: string) => {
    const canPreview = status === "generated";
    const canDownload = status === "generated";
    const showActions = true;
    
    return (
      <div className="flex space-x-2">
        {canPreview && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Voir</span>
          </Button>
        )}
        
        {canDownload && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
            <span className="sr-only">Télécharger</span>
          </Button>
        )}
        
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Plus d'options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>Régénérer le document</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <FileBadge className="mr-2 h-4 w-4" />
                <span>Appliquer signature E. Chiche</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Mettre à jour CEE</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };
  
  // Get document preview content
  const getDocumentPreview = (docId: string, status: string) => {
    // In a real implementation, this would display a PDF preview or document details
    const isGenerated = status === "generated";
    
    if (isGenerated) {
      return (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-100 border rounded-md p-4 h-64 flex items-center justify-center">
            <p className="text-gray-500">Prévisualisation du document PDF</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Métadonnées du document</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">Date de génération</p>
                <p>18/05/2025 14:30</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Signature client</p>
                <Badge variant="outline" className="bg-green-50">Présente</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Signature E. Chiche</p>
                <Badge variant="outline" className="bg-green-50">Présente</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Source des données</p>
                <p>CEE PREVIO du 15/05/2025</p>
              </div>
            </div>
            
            <div className="pt-4 flex space-x-2 border-t mt-4">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Régénérer
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="mt-4 space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
            <h4 className="font-semibold text-orange-800 mb-2">En attente de données</h4>
            <p className="text-orange-700 mb-4">
              Ce document nécessite des données du CEE PREVIO pour être généré. Veuillez traiter le fichier CEE PREVIO.
            </p>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Traiter CEE PREVIO (OCR)
            </Button>
          </div>
        </div>
      );
    } else if (status === "ready") {
      return (
        <div className="mt-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Prêt à générer</h4>
            <p className="text-blue-700 mb-4">
              Toutes les données nécessaires sont disponibles. Le document peut être généré.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileBadge className="mr-2 h-4 w-4" />
              Générer ce document
            </Button>
          </div>
        </div>
      );
    } else if (status === "error") {
      return (
        <div className="mt-4 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="font-semibold text-red-800 mb-2">Erreur lors de la génération</h4>
            <p className="text-red-700 mb-4">
              Une erreur s'est produite lors de la génération du document. Veuillez vérifier les données sources et réessayer.
            </p>
            <div className="bg-red-100 p-3 rounded text-xs font-mono mb-4">
              Error: Les données Ki et Kf sont incohérentes. Veuillez rafraîchir les données OCR.
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                <Settings className="mr-2 h-4 w-4" />
                Mettre à jour OCR
              </Button>
              <Button variant="destructive">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer la génération
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Document non disponible</h4>
            <p className="text-gray-700 mb-4">
              Ce document n'a pas encore été créé ou est manquant. Veuillez ajouter les informations nécessaires.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems} className="w-full">
      {documentTypes.map((doc) => (
        <AccordionItem value={doc.id} key={doc.id} className="border-b">
          <AccordionTrigger className="py-4">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center">
                <span className="font-medium">{doc.name}</span>
                <span className="text-sm text-gray-500 ml-2">({doc.description})</span>
              </div>
              <div className="flex items-center">
                {getStatusBadge(doc.status)}
                <div className="ml-4">{getActionButtons(doc.id, doc.status)}</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {getDocumentPreview(doc.id, doc.status)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default DocumentAccordion;
