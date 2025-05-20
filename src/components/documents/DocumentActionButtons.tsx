
import { Eye, Download, RefreshCw, RefreshCcw, Link, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentStatus } from "@/models/documents";

type ActionType = 
  | "view" 
  | "download" 
  | "generate" 
  | "regenerate"
  | "refresh-ocr" 
  | "update-cee" 
  | "link-files"
  | "link-photos"
  | "link-dni";

interface DocumentActionButtonsProps {
  documentType: string;
  status: DocumentStatus;
  onAction: (action: ActionType) => void;
}

const DocumentActionButtons = ({ documentType, status, onAction }: DocumentActionButtonsProps) => {
  // Définir les actions disponibles en fonction du type de document et de son statut
  const getAvailableActions = (): ActionType[] => {
    // Actions de base disponibles pour la plupart des documents générés
    if (status === "generated" || status === "linked") {
      const actions: ActionType[] = ["view", "download"];
      
      // Actions spécifiques selon le type de document
      if (documentType === "ficha") {
        actions.push("refresh-ocr");
      }
      else if (documentType === "certificado") {
        actions.push("update-cee");
      }
      
      return actions;
    }
    
    // Document prêt à être généré
    if (status === "ready") {
      return ["generate"];
    }
    
    // Document en attente avec aperçu disponible
    if (status === "pending") {
      if (documentType === "factura") {
        return ["view"]; // Voir le brouillon
      }
      return [];
    }
    
    // Document manquant qui nécessite une liaison
    if (status === "missing") {
      if (documentType === "ceee") return ["link-files"];
      if (documentType === "dni") return ["link-dni"];
      if (documentType === "fotos") return ["link-photos"];
      return [];
    }
    
    // En cas d'erreur, permettre de réessayer la génération
    if (status === "error") {
      return ["regenerate"];
    }
    
    return [];
  };

  // Rendu du bouton en fonction du type d'action
  const renderActionButton = (action: ActionType) => {
    switch (action) {
      case "view":
        return (
          <Button key="view" variant="ghost" size="sm" onClick={() => onAction("view")}>
            <Eye className="h-4 w-4 mr-1" /> Voir
          </Button>
        );
      case "download":
        return (
          <Button key="download" variant="ghost" size="sm" onClick={() => onAction("download")}>
            <Download className="h-4 w-4 mr-1" /> Télécharger
          </Button>
        );
      case "generate":
        return (
          <Button key="generate" variant="default" size="sm" onClick={() => onAction("generate")}>
            <FileText className="h-4 w-4 mr-1" /> Générer
          </Button>
        );
      case "regenerate":
        return (
          <Button key="regenerate" variant="default" size="sm" onClick={() => onAction("regenerate")}>
            <RefreshCw className="h-4 w-4 mr-1" /> Régénérer
          </Button>
        );
      case "refresh-ocr":
        return (
          <Button key="refresh-ocr" variant="outline" size="sm" onClick={() => onAction("refresh-ocr")}>
            <RefreshCcw className="h-4 w-4 mr-1" /> MàJ OCR
          </Button>
        );
      case "update-cee":
        return (
          <Button key="update-cee" variant="outline" size="sm" onClick={() => onAction("update-cee")}>
            <RefreshCcw className="h-4 w-4 mr-1" /> MàJ CEE
          </Button>
        );
      case "link-files":
        return (
          <Button key="link-files" variant="outline" size="sm" onClick={() => onAction("link-files")}>
            <Link className="h-4 w-4 mr-1" /> Lier Fichiers
          </Button>
        );
      case "link-photos":
        return (
          <Button key="link-photos" variant="outline" size="sm" onClick={() => onAction("link-photos")}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter Photos
          </Button>
        );
      case "link-dni":
        return (
          <Button key="link-dni" variant="outline" size="sm" onClick={() => onAction("link-dni")}>
            <Link className="h-4 w-4 mr-1" /> Lier DNI
          </Button>
        );
      default:
        return null;
    }
  };

  const availableActions = getAvailableActions();

  return (
    <div className="flex flex-wrap gap-2">
      {availableActions.map(action => renderActionButton(action))}
    </div>
  );
};

export default DocumentActionButtons;
