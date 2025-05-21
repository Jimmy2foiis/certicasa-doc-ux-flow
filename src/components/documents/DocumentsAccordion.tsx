
import { AdministrativeDocument } from "@/types/documents";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useState } from "react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import { Eye, Download, MoreHorizontal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { PDFViewer } from "./PDFViewer";

interface DocumentsAccordionProps {
  documents: AdministrativeDocument[];
  onDocumentAction: (documentId: string, action: string) => void;
  title?: string;
}

const DocumentsAccordion = ({ documents, onDocumentAction, title }: DocumentsAccordionProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  
  const handleValueChange = (value: string) => {
    setOpenItem(value === openItem ? null : value);
  };
  
  // Sort documents by order
  const allDocuments = documents.sort((a, b) => a.order - b.order);
  
  // Count documents by status
  const statusCounts = {
    total: allDocuments.length,
    generated: allDocuments.filter(doc => doc.status === "generated" || doc.status === "linked").length,
    ready: allDocuments.filter(doc => doc.status === "ready").length,
    pending: allDocuments.filter(doc => doc.status === "pending" || doc.status === "action-required").length,
    missing: allDocuments.filter(doc => doc.status === "missing").length,
  };
  
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl font-semibold">{title}</h2>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
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
        <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">
          Manquants ({statusCounts.missing})
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
          <AccordionItem 
            key={document.id} 
            value={document.id} 
            className="border rounded-lg mb-3 border-gray-200 overflow-hidden"
          >
            <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50 py-2">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {document.order}
                  </span>
                  <span className="font-medium">{document.name}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <DocumentStatusBadge 
                    status={document.status} 
                    customLabel={document.statusLabel}
                  />
                  
                  {/* Quick action buttons that appear on the document row */}
                  {(document.status === "generated" || document.status === "linked") && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentAction(document.id, "view");
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentAction(document.id, "download");
                        }}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Télécharger</span>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Plus d'options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onDocumentAction(document.id, "regenerate")}>
                            Régénérer le document
                          </DropdownMenuItem>
                          {document.type === "ficha" && (
                            <DropdownMenuItem onClick={() => onDocumentAction(document.id, "refresh-ocr")}>
                              Mettre à jour CEE pour ce document
                            </DropdownMenuItem>
                          )}
                          {document.type === "certificado" && (
                            <DropdownMenuItem onClick={() => onDocumentAction(document.id, "update-cee")}>
                              Actualiser depuis CEE
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-0">
              <DocumentAccordionContent 
                document={document} 
                onAction={onDocumentAction}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Component for the content of the document accordion
const DocumentAccordionContent = ({ document, onAction }: { 
  document: AdministrativeDocument, 
  onAction: (documentId: string, action: string) => void 
}) => {
  // Determine contextual content to display based on status
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
              <Button 
                onClick={() => onAction(document.id, "generate")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                ✅ Générer ce document
              </Button>
            </div>
          </div>
        );
      
      case "generated":
      case "linked":
        return (
          <div className="space-y-4">
            {document.content && (
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                <div className="h-[500px]">
                  <PDFViewer 
                    fileUrl={document.content.startsWith('data:') ? document.content : `data:application/pdf;base64,${document.content}`} 
                    fileName={document.name}
                  />
                </div>
              </div>
            )}
            
            {!document.content && (
              <div className="border border-gray-200 rounded-md p-4 bg-white">
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
                  <span className="text-muted-foreground">Aperçu du document non disponible</span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => onAction(document.id, "view")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ouvrir le document
              </Button>
              <Button 
                onClick={() => onAction(document.id, "download")}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button 
                onClick={() => onAction(document.id, "regenerate")}
                variant="outline"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Régénérer le document
              </Button>
              {document.type === "ficha" && (
                <Button 
                  onClick={() => onAction(document.id, "refresh-ocr")}
                  variant="outline"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Mettre à jour CEE
                </Button>
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
              <Button 
                onClick={() => onAction(document.id, document.type === "certificado" ? "update-cee" : "refresh-ocr")}
                className="mt-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm"
                variant="outline"
              >
                ⚙️ {document.type === "ficha" ? "Traiter CEE PREVIO (OCR)" : "Actualiser depuis CEE"}
              </Button>
            )}
            
            {document.statusLabel?.includes("signature") && (
              <div className="mt-2 p-2 bg-amber-100 text-amber-800 rounded text-sm">
                ✒️ Signatures client en attente (via Safety Culture)
              </div>
            )}
          </div>
        );
      
      case "action-required":
        return (
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-amber-700 font-medium">Action requise</p>
            <p className="text-sm text-amber-600">{document.statusLabel || "Une action est requise"}</p>
            {document.type === "fotos" && (
              <Button 
                onClick={() => onAction(document.id, "link-photos")}
                className="mt-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm"
                variant="outline"
              >
                Ajouter des photos
              </Button>
            )}
            
            {document.type === "certificado" && (
              <Button 
                onClick={() => onAction(document.id, "add-signature")}
                className="mt-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm"
                variant="outline"
              >
                ✒️ Appliquer signature E. Chiche
              </Button>
            )}
          </div>
        );
      
      case "missing":
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700 font-medium">Document manquant</p>
            <p className="text-sm text-gray-600">Ce document doit être ajouté au dossier.</p>
            {document.type === "ceee" && (
              <Button 
                onClick={() => onAction(document.id, "link-files")}
                className="mt-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
                variant="outline"
              >
                Lier des fichiers
              </Button>
            )}
            {document.type === "dni" && (
              <Button 
                onClick={() => onAction(document.id, "link-dni")}
                className="mt-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
                variant="outline"
              >
                Lier le DNI
              </Button>
            )}
          </div>
        );
      
      default:
        return <p className="text-muted-foreground">Aucune action disponible</p>;
    }
  };

  return (
    <div className="py-4 px-4 border-t bg-gray-50">
      {renderContextualContent()}
    </div>
  );
};

export default DocumentsAccordion;
