import React from "react";
import type { AdministrativeDocument, DocumentStatus } from "@/types/documents";
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge";
import DocumentActionButtons from "@/components/documents/DocumentActionButtons";
import { FileText, Eye, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsListProps {
  documents: AdministrativeDocument[];
  isLoading: boolean;
  onAction: (documentId: string, action: string) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading,
  onAction
}) => {
  if (isLoading) {
    return <DocumentsLoadingState />;
  }

  if (documents.length === 0) {
    return <DocumentsEmptyState />;
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-md">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {doc.category} • {new Date(doc.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <DocumentStatusBadge status={doc.status as DocumentStatus} />
            
            {/* Boutons d'action principaux (Voir/Télécharger) */}
            <div className="flex space-x-2">
              {(doc.status === "generated" || doc.status === "linked") && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onAction(doc.id, "view")}
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1.5" />
                    <span>Voir</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onAction(doc.id, "download")}
                    className="flex items-center"
                  >
                    <FileDown className="h-4 w-4 mr-1.5" />
                    <span>Télécharger</span>
                  </Button>
                </>
              )}
              
              {/* Autres boutons d'action spécifiques */}
              <DocumentActionButtons 
                documentType={doc.type} 
                status={doc.status as DocumentStatus}
                onAction={(action) => onAction(doc.id, action)}
                showViewDownload={false}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DocumentsLoadingState = () => (
  <div className="space-y-3">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
          <div>
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 mt-2 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
      </div>
    ))}
  </div>
);

const DocumentsEmptyState = () => (
  <div className="text-center py-8">
    <p className="text-muted-foreground">Aucun document trouvé</p>
  </div>
);
