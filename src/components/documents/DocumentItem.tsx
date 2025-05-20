
import { AdministrativeDocument } from "@/models/documents";
import { Eye, Download, MoreHorizontal } from "lucide-react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DocumentItemProps {
  document: AdministrativeDocument;
  onAction: (documentId: string, action: string) => void;
  isOpen: boolean;
}

const DocumentItem = ({ document, onAction, isOpen }: DocumentItemProps) => {
  // Déterminer quelles actions sont disponibles selon le statut du document
  const canView = document.status === "generated" || document.status === "linked";
  const canDownload = document.status === "generated" || document.status === "linked";
  
  // Déterminer les actions du menu contextuel
  const getContextMenuActions = () => {
    const actions = [];
    
    if (document.status === "generated") {
      actions.push({
        label: "Régénérer le document",
        action: "regenerate"
      });
    }
    
    if (document.type === "ficha") {
      actions.push({
        label: "Mettre à jour OCR",
        action: "refresh-ocr"
      });
    }
    
    if (document.type === "certificado") {
      actions.push({
        label: "Mettre à jour CEE",
        action: "update-cee"
      });
    }
    
    // Ajouter d'autres actions contextuelles selon les types de documents
    return actions;
  };
  
  const contextMenuActions = getContextMenuActions();
  
  return (
    <div className="w-full flex items-center justify-between py-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center space-x-3">
        <span className="bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs">
          {document.order}
        </span>
        <div>
          <p className="font-medium text-foreground text-sm">{document.name}</p>
          <p className="text-xs text-muted-foreground">{document.description}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <DocumentStatusBadge 
          status={document.status} 
          customLabel={document.statusLabel}
        />
        
        <div className="flex space-x-1">
          {canView && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onAction(document.id, "view");
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Voir</span>
            </Button>
          )}
          
          {canDownload && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onAction(document.id, "download");
              }}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Télécharger</span>
            </Button>
          )}
          
          {contextMenuActions.length > 0 && (
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
                {contextMenuActions.map((item, index) => (
                  <DropdownMenuItem 
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(document.id, item.action);
                    }}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;
