
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AdministrativeDocument, DocumentStatus } from '@/types/documents';
import {
  documentService,
  getDocumentContent,
} from '@/services/documentService';

export const useDocumentActions = (
  filteredDocuments: AdministrativeDocument[],
  baseHandleDocumentAction: (documentId: string, action: string) => void
) => {
  const [previewDocument, setPreviewDocument] = useState<AdministrativeDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDocumentAction = async (documentId: string, action: string) => {
    try {
      setError(null);

      switch (action) {
        case 'generate':
          toast({
            title: 'Génération en cours',
            description: 'Le document est en cours de génération...',
          });
          
          setTimeout(() => {
            toast({
              title: '✅ Document généré',
              description: 'Le document a été généré avec succès',
            });
          }, 2000);
          
          baseHandleDocumentAction(documentId, action);
          break;

        case 'regenerate':
          toast({
            title: 'Régénération en cours',
            description: 'Le document est en cours de régénération...',
          });
          
          setTimeout(() => {
            toast({
              title: '✅ Document régénéré',
              description: 'Le document a été régénéré avec succès',
            });
          }, 2000);
          
          baseHandleDocumentAction(documentId, action);
          break;

        case 'view':
          const docToPreview = filteredDocuments.find((doc) => doc.id === documentId);
          if (docToPreview) {
            setPreviewDocument({
              ...docToPreview,
              description: (docToPreview as any).description || '',
              order: (docToPreview as any).order || 0,
              status: docToPreview.status as DocumentStatus,
            });
            setIsPreviewOpen(true);
          } else {
            setError('Document introuvable');
            toast({
              title: 'Erreur',
              description: 'Document introuvable',
              variant: 'destructive',
            });
          }
          break;

        case 'download':
          await handleDownload(documentId);
          break;

        default:
          baseHandleDocumentAction(documentId, action);
      }
    } catch (error) {
      console.error("Erreur lors de l'action sur le document:", error);
      setError(error instanceof Error ? error.message : 'Erreur inattendue');
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du traitement de votre demande',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (documentId: string) => {
    const docToDownload = filteredDocuments.find((doc) => doc.id === documentId);
    if (!docToDownload) {
      setError('Document introuvable');
      toast({
        title: 'Erreur',
        description: 'Document introuvable',
        variant: 'destructive',
      });
      return;
    }

    if (docToDownload.content) {
      const validationResult = documentService.validateDocumentContent(
        docToDownload.content,
        docToDownload.type,
      );

      if (!validationResult.success) {
        setError(`Contenu de document invalide: ${validationResult.error}`);
        toast({
          title: 'Erreur',
          description: validationResult.error,
          variant: 'destructive',
        });
        return;
      }

      const downloadResult = await documentService.downloadDocument(
        docToDownload.content,
        docToDownload.name,
        docToDownload.type,
      );

      if (downloadResult.success) {
        toast({
          title: 'Téléchargement réussi',
          description: `Le document ${docToDownload.name} a été téléchargé avec succès`,
        });
      } else {
        setError(`Erreur de téléchargement: ${downloadResult.error}`);
        toast({
          title: 'Erreur de téléchargement',
          description: downloadResult.error || 'Impossible de télécharger le document',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Téléchargement en cours',
        description: 'Récupération du document...',
      });

      const documentData = await getDocumentContent(documentId);

      if (documentData && documentData.success && documentData.data?.content) {
        const validationResult = documentService.validateDocumentContent(
          documentData.data.content,
          documentData.data.type,
        );

        if (!validationResult.success) {
          setError(`Contenu de document invalide: ${validationResult.error}`);
          toast({
            title: 'Erreur',
            description: validationResult.error,
            variant: 'destructive',
          });
          return;
        }

        const downloadResult = await documentService.downloadDocument(
          documentData.data.content,
          documentData.data.name,
          documentData.data.type,
        );

        if (downloadResult.success) {
          toast({
            title: 'Téléchargement réussi',
            description: `Le document ${documentData.data.name} a été téléchargé avec succès`,
          });
        } else {
          setError(`Erreur de téléchargement: ${downloadResult.error}`);
          toast({
            title: 'Erreur de téléchargement',
            description: downloadResult.error || 'Impossible de télécharger le document',
            variant: 'destructive',
          });
        }
      } else {
        setError('Contenu du document non disponible ou invalide');
        toast({
          title: 'Erreur',
          description: documentData.error || 'Contenu du document non disponible',
          variant: 'destructive',
        });
      }
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  return {
    handleDocumentAction,
    previewDocument,
    isPreviewOpen,
    error,
    setError,
    handleClosePreview,
  };
};
