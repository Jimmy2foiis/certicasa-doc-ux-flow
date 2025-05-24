
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileX,
  CheckCircle2
} from 'lucide-react';

// Enhanced status with operational context
export const getOperationalStatus = (status: string) => {
  switch (status) {
    case 'missing':
    case 'pending':
      return {
        label: 'À générer',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock,
        description: 'Par défaut, jamais généré'
      };
    case 'generated':
    case 'available':
    case 'linked':
      return {
        label: 'Généré',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        description: 'Fichier généré avec succès'
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
        description: 'Génération échouée'
      };
    case 'ready':
      return {
        label: 'Manquant',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: FileX,
        description: 'Élément source non fourni'
      };
    case 'signed':
      return {
        label: 'Validé',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
        description: 'Vérifié par un opérateur admin'
      };
    default:
      return {
        label: 'À générer',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock,
        description: 'Par défaut, jamais généré'
      };
  }
};
