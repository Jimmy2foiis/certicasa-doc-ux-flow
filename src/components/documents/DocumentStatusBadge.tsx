
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
          icon: "✓"
        };
      case "ready":
        return { 
          label: customLabel || "Prêt à générer", 
          variant: "default" as const,
          icon: "→"
        };
      case "pending":
        return { 
          label: customLabel || "En attente", 
          variant: "outline" as const,
          icon: "⏱"
        };
      case "missing":
        return { 
          label: customLabel || "Manquant", 
          variant: "outline" as const,
          icon: "○"
        };
      case "action-required":
        return { 
          label: customLabel || "Action requise", 
          variant: "outline" as const,
          icon: "!"
        };
      case "error":
        return { 
          label: customLabel || "Erreur", 
          variant: "destructive" as const,
          icon: "✗"
        };
      case "linked":
        return { 
          label: customLabel || "Fichier lié", 
          variant: "success" as const,
          icon: "✓"
        };
      default:
        return { 
          label: "Inconnu", 
          variant: "outline" as const,
          icon: "?"
        };
    }
  };

  const { label, variant, icon } = getStatusDetails(status);

  return (
    <Badge variant={variant} className="flex items-center gap-1.5 font-normal">
      <span>{icon}</span>
      <span>{label}</span>
    </Badge>
  );
};

export default DocumentStatusBadge;
