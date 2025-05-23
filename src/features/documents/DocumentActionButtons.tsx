import React from 'react';
import { Eye, Download, RefreshCw, RefreshCcw, Link, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DocumentStatus } from '@/types/documents';

type ActionType =
  | 'view'
  | 'download'
  | 'generate'
  | 'regenerate'
  | 'refresh-ocr'
  | 'update-cee'
  | 'link-files'
  | 'link-photos'
  | 'link-dni';

interface DocumentActionButtonsProps {
  documentType: string;
  status: DocumentStatus;
  onAction: (action: ActionType) => void;
  showViewDownload?: boolean; // Nouveau prop pour contrôler l'affichage des boutons voir/télécharger
}

const DocumentActionButtons = ({
  documentType,
  status,
  onAction,
  showViewDownload = true,
}: DocumentActionButtonsProps) => {
  // Définir les actions disponibles en fonction du type de document et de son statut
  const getAvailableActions = (): ActionType[] => {
    // Actions de base basées sur le statut
    if (status === 'generated' || status === 'linked') {
      // Ne pas inclure view/download si showViewDownload est false pour éviter les doublons
      const actions: ActionType[] = showViewDownload ? ['view', 'download'] : [];

      // Actions spécifiques selon le type de document
      if (documentType === 'ficha') {
        actions.push('refresh-ocr');
      } else if (documentType === 'certificado') {
        actions.push('update-cee');
      }

      return actions;
    }

    // Document prêt à être généré
    if (status === 'ready') {
      return ['generate'];
    }

    // Document en attente avec aperçu disponible
    if (status === 'pending') {
      if (documentType === 'factura') {
        return showViewDownload ? ['view'] : [];
      }
      return [];
    }

    // Document manquant qui nécessite une liaison
    if (status === 'missing') {
      if (documentType === 'ceee') return ['link-files'];
      if (documentType === 'dni') return ['link-dni'];
      if (documentType === 'fotos') return ['link-photos'];
      return [];
    }

    // En cas d'erreur, permettre de réessayer la génération
    if (status === 'error') {
      return ['regenerate'];
    }

    return [];
  };

  // Rendu du bouton en fonction du type d'action
  const renderActionButton = (action: ActionType) => {
    switch (action) {
      case 'view':
        return (
          <Button
            key="view"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => onAction('view')}
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> Voir
          </Button>
        );
      case 'download':
        return (
          <Button
            key="download"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => onAction('download')}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Télécharger
          </Button>
        );
      case 'generate':
        return (
          <Button
            key="generate"
            variant="default"
            size="sm"
            className="h-8"
            onClick={() => onAction('generate')}
          >
            <FileText className="h-3.5 w-3.5 mr-1" /> Générer
          </Button>
        );
      case 'regenerate':
        return (
          <Button
            key="regenerate"
            variant="default"
            size="sm"
            className="h-8"
            onClick={() => onAction('regenerate')}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Régénérer
          </Button>
        );
      case 'refresh-ocr':
        return (
          <Button
            key="refresh-ocr"
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onAction('refresh-ocr')}
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" /> MàJ OCR
          </Button>
        );
      case 'update-cee':
        return (
          <Button
            key="update-cee"
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onAction('update-cee')}
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" /> MàJ CEE
          </Button>
        );
      case 'link-files':
        return (
          <Button
            key="link-files"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => onAction('link-files')}
          >
            <Link className="h-3.5 w-3.5 mr-1" /> Lier Fichiers
          </Button>
        );
      case 'link-photos':
        return (
          <Button
            key="link-photos"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => onAction('link-photos')}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter Photos
          </Button>
        );
      case 'link-dni':
        return (
          <Button
            key="link-dni"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => onAction('link-dni')}
          >
            <Link className="h-3.5 w-3.5 mr-1" /> Lier DNI
          </Button>
        );
      default:
        return null;
    }
  };

  const availableActions = getAvailableActions();

  return (
    <div className="flex flex-wrap gap-2">
      {availableActions.map((action) => renderActionButton(action))}
    </div>
  );
};

export default DocumentActionButtons;
// Exporter également en tant qu'export nommé pour la cohérence
export { DocumentActionButtons };
