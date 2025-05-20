
import { Badge } from "@/components/ui/badge";
import { DocumentStatus } from "@/models/documents";
import { CheckCircle, Clock, AlertTriangle, XCircle, Link as LinkIcon, FileText } from "lucide-react";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  customLabel?: string;
}

const DocumentStatusBadge = ({ status, customLabel }: DocumentStatusBadgeProps) => {
  const getStatusDetails = (status: DocumentStatus) => {
    switch (status) {
      case "generated":
        return { 
          label: customLabel || "Généré", 
          variant: "success" as const,
          icon: CheckCircle
        };
      case "ready":
        return { 
          label: customLabel || "Prêt à générer", 
          variant: "default" as const,
          icon: FileText
        };
      case "pending":
        return { 
          label: customLabel || "En attente", 
          variant: "outline" as const,
          icon: Clock
        };
      case "missing":
        return { 
          label: customLabel || "Manquant", 
          variant: "outline" as const,
          icon: FileText
        };
      case "action-required":
        return { 
          label: customLabel || "Action requise", 
          variant: "outline" as const,
          icon: AlertTriangle
        };
      case "error":
        return { 
          label: customLabel || "Erreur", 
          variant: "destructive" as const,
          icon: XCircle
        };
      case "linked":
        return { 
          label: customLabel || "Fichier lié", 
          variant: "success" as const,
          icon: LinkIcon
        };
      default:
        return { 
          label: "Inconnu", 
          variant: "outline" as const,
          icon: FileText
        };
    }
  };

  const { label, variant, icon: Icon } = getStatusDetails(status);

  return (
    <Badge variant={variant} className="flex items-center gap-1.5 font-normal">
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </Badge>
  );
};

export default DocumentStatusBadge;
