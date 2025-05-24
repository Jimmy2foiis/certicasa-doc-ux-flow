
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileX,
  CheckCircle2,
  Settings
} from 'lucide-react';

// Enhanced status with operational context
export const getOperationalStatus = (status: string) => {
  switch (status) {
    case 'missing':
    case 'pending':
      return {
        label: 'À générer',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Settings,
        description: 'Prêt à être généré avec les données disponibles'
      };
    case 'generated':
    case 'available':
    case 'linked':
      return {
        label: 'Généré',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        description: 'Document généré avec succès'
      };
    case 'action-required':
      return {
        label: 'À vérifier',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: AlertTriangle,
        description: 'Document à relire ou valider'
      };
    case 'error':
      return {
        label: 'Erreur',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        description: 'Erreur lors de la génération'
      };
    case 'ready':
      return {
        label: 'Prêt',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Settings,
        description: 'Toutes les données sont disponibles'
      };
    case 'signed':
      return {
        label: 'Signé Certicasa',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
        description: 'Document validé et signé par l\'équipe Certicasa'
      };
    default:
      return {
        label: 'À générer',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Settings,
        description: 'Document en attente de génération'
      };
  }
};
