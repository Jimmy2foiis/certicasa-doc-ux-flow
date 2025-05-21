import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Eye } from "lucide-react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import { Document } from "@/types/documents";
import { DocumentStatus } from "@/models/documents";

interface DocumentsAccordionProps {
  documents: Document[];
  onDocumentAction: (action: string, documentId: string) => void;
}

const DocumentsAccordion = ({ documents, onDocumentAction }: DocumentsAccordionProps) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Aucun document trouvé
      </div>
    );
  }

  // Helper function to convert string status to DocumentStatus type
  const mapToDocumentStatus = (status: string | undefined): DocumentStatus => {
    const validStatuses: DocumentStatus[] = [
      "generated", "ready", "pending", "missing", "action-required", "error", "linked"
    ];
    
    if (status && validStatuses.includes(status as DocumentStatus)) {
      return status as DocumentStatus;
    }
    return "pending"; // Default status
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {documents.map((doc) => (
        <AccordionItem key={doc.id} value={doc.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <DocumentStatusBadge status={mapToDocumentStatus(doc.status)} />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">{doc.name}</h4>
                  <p className="text-sm text-gray-500">{doc.type || 'Document'}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Date inconnue'}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 py-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    {(doc as any).description || "Document généré pour le client"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => onDocumentAction('view', doc.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => onDocumentAction('download', doc.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDocumentAction('delete', doc.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default DocumentsAccordion;
