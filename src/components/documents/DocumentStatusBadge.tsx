
import { Badge } from "@/components/ui/badge";
import { DocumentStatus } from "@/types/documents";
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
  
  // Determine badge color based on status
  let badgeColor = '';
  switch (status) {
    case "generated":
    case "linked":
      badgeColor = "bg-green-100 text-green-800 border-green-200"; // Green
      break;
    case "ready":
      badgeColor = "bg-blue-100 text-blue-800 border-blue-200"; // Blue
      break;
    case "pending":
    case "action-required":
      badgeColor = "bg-amber-100 text-amber-800 border-amber-200"; // Yellow
      break;
    case "missing":
      badgeColor = "bg-gray-100 text-gray-800 border-gray-200"; // Gray
      break;
    case "error":
      badgeColor = "bg-red-100 text-red-800 border-red-200"; // Red
      break;
    default:
      badgeColor = "bg-gray-100 text-gray-800 border-gray-200"; // Default gray
  }

  return (
    <Badge 
      variant={variant} 
      className={`flex items-center gap-1.5 font-normal px-2 py-1 ${badgeColor}`}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </Badge>
  );
};

export default DocumentStatusBadge;
// Also export as a named export for consistency
export { DocumentStatusBadge };
