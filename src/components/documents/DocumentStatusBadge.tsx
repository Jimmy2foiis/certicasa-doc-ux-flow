import { Badge } from "@/components/ui/badge";
import { DocumentStatus } from "@/models/documents";

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
          emoji: "🟢"
        };
      case "ready":
        return { 
          label: customLabel || "Prêt à générer", 
          variant: "default" as const,
          emoji: "🔵"
        };
      case "pending":
        return { 
          label: customLabel || "En attente", 
          variant: "outline" as const,
          emoji: "🟡"
        };
      case "missing":
        return { 
          label: customLabel || "Manquant", 
          variant: "outline" as const,
          emoji: "⚪️"
        };
      case "action-required":
        return { 
          label: customLabel || "Action requise", 
          variant: "outline" as const,
          emoji: "🟠"
        };
      case "error":
        return { 
          label: customLabel || "Erreur", 
          variant: "destructive" as const,
          emoji: "🔴"
        };
      case "linked":
        return { 
          label: customLabel || "Fichier lié", 
          variant: "success" as const,
          emoji: "🟢"
        };
      default:
        return { 
          label: "Inconnu", 
          variant: "outline" as const,
          emoji: "⚪️"
        };
    }
  };

  const { label, variant, emoji } = getStatusDetails(status);

  return (
    <Badge variant={variant} className="flex items-center gap-1.5">
      <span>{emoji}</span>
      <span>{label}</span>
    </Badge>
  );
};

export default DocumentStatusBadge;
