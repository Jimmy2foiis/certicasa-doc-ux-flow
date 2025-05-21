
import { AdministrativeDocument } from "@/models/documents";
import DocumentItem from "./DocumentItem";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useState } from "react";

interface DocumentsAccordionProps {
  documents: AdministrativeDocument[];
  onDocumentAction: (documentId: string, action: string) => void;
}

const DocumentsAccordion = ({ documents, onDocumentAction }: DocumentsAccordionProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  
  const handleValueChange = (value: string) => {
    setOpenItem(value === openItem ? null : value);
  };
  
  // Regrouper les documents par catégorie
  const allDocuments = documents.sort((a, b) => a.order - b.order);
  
  // Compter les documents par statut
  const statusCounts = {
    total: allDocuments.length,
    generated: allDocuments.filter(doc => doc.status === "generated" || doc.status === "linked").length,
    ready: allDocuments.filter(doc => doc.status === "ready").length,
    pending: allDocuments.filter(doc => doc.status === "pending" || doc.status === "action-required").length,
  };
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-muted hover:bg-muted/80 cursor-pointer">
          Tous ({statusCounts.total})
        </span>
        <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer">
          Générés ({statusCounts.generated})
        </span>
        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer">
          Prêts ({statusCounts.ready})
        </span>
        <span className="text-sm px-3 py-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer">
          En attente ({statusCounts.pending})
        </span>
      </div>
      
      <Accordion 
        type="single" 
        collapsible 
        className="w-full" 
        value={openItem || ""}
        onValueChange={handleValueChange}
      >
        {allDocuments.map((document) => (
          <AccordionItem key={document.id} value={document.id} className="border rounded-lg mb-3 border-gray-200 overflow-hidden">
            <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
              <DocumentItem 
                document={document} 
                onAction={onDocumentAction}
                isOpen={document.id === openItem}
              />
            </AccordionTrigger>
            <AccordionContent className="px-0">
              <div className="border-t pt-3 pb-1 px-4 bg-gray-50">
                <DocumentItemContent 
                  document={document} 
                  onAction={onDocumentAction}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="text-sm text-muted-foreground pt-2">
        {statusCounts.total} document(s) au total
      </div>
    </div>
  );
};

// Composant pour le contenu du document dans l'accordéon
const DocumentItemContent = ({ document, onAction }: { 
  document: AdministrativeDocument, 
  onAction: (documentId: string, action: string) => void 
}) => {
  // Déterminer le contenu contextuel à afficher en fonction du statut
  const renderContextualContent = () => {
    switch (document.status) {
      case "ready":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-700 font-medium">Document prêt à être généré</p>
              <p className="text-sm text-blue-600">Toutes les données sont disponibles pour générer ce document.</p>
            </div>
            <div className="flex justify-start">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(document.id, "generate");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Générer ce document
              </button>
            </div>
          </div>
        );
      
      case "generated":
      case "linked":
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-md p-4 bg-white">
              <p className="text-gray-700 font-medium">Aperçu du document</p>
              <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md mt-2 bg-gray-50">
                <span className="text-muted-foreground">Prévisualisation du document</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(document.id, "view");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ouvrir le document
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(document.id, "download");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Télécharger
              </button>
              {document.type === "ficha" && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(document.id, "refresh-ocr");
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Mettre à jour OCR
                </button>
              )}
              {document.type === "certificado" && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(document.id, "update-cee");
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Mettre à jour CEE
                </button>
              )}
            </div>
          </div>
        );
      
      case "pending":
        return (
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-amber-700 font-medium">Document en attente</p>
            <p className="text-sm text-amber-600">
              {document.statusLabel || "En attente de données complémentaires"}
            </p>
            {document.statusLabel?.includes("CEE") && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(document.id, document.type === "certificado" ? "update-cee" : "refresh-ocr");
                }}
                className="mt-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm"
              >
                Vérifier le CEE
              </button>
            )}
          </div>
        );
      
      case "action-required":
        return (
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-amber-700 font-medium">Action requise</p>
            <p className="text-sm text-amber-600">{document.statusLabel || "Une action est requise"}</p>
            {document.type === "fotos" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(document.id, "link-photos");
                }}
                className="mt-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm"
              >
                Ajouter des photos
              </button>
            )}
          </div>
        );
      
      case "missing":
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700 font-medium">Document manquant</p>
            <p className="text-sm text-gray-600">Ce document doit être ajouté au dossier.</p>
            {document.type === "ceee" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(document.id, "link-files");
                }}
                className="mt-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                Lier des fichiers
              </button>
            )}
            {document.type === "dni" && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(document.id, "link-dni");
                }}
                className="mt-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                Lier le DNI
              </button>
            )}
          </div>
        );
      
      default:
        return <p className="text-muted-foreground">Aucune action disponible</p>;
    }
  };

  return (
    <div className="py-2">
      {renderContextualContent()}
    </div>
  );
};

export default DocumentsAccordion;
