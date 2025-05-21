
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from './PDFViewer';
import { Button } from '@/components/ui/button';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentService } from '@/services/documentService';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    type: string;
    content?: string | null;
    file_path?: string | null;
  } | null;
  onDownload: (documentId: string) => void;
}

export const DocumentPreview = ({ isOpen, onClose, document, onDownload }: DocumentPreviewProps) => {
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && document) {
      setIsLoading(true);
      setError(null);

      try {
        // Déterminer le type de document
        const fileType = document.type.toLowerCase();
        
        // Si ce n'est pas un PDF, on ne peut pas l'afficher directement
        if (fileType !== 'pdf') {
          setIsLoading(false);
          setError(`La prévisualisation n'est pas disponible pour les fichiers ${fileType.toUpperCase()}. Veuillez télécharger le document.`);
          return;
        }
        
        // Créer l'URL de prévisualisation pour les PDF
        if (document.content) {
          const previewResult = documentService.createDocumentPreviewUrl(document.content, document.type);
          
          if (previewResult.success && previewResult.data) {
            setPdfUrl(previewResult.data);
          } else {
            throw new Error(previewResult.error || "Impossible de créer l'URL de prévisualisation");
          }
        } else if (document.file_path) {
          setPdfUrl(document.file_path);
        } else {
          throw new Error("Aucun contenu disponible pour ce document");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du document:", err);
        setError(`Impossible de charger le document: ${err instanceof Error ? err.message : String(err)}`);
        toast({
          title: "Erreur",
          description: "Impossible de charger le document pour prévisualisation",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Nettoyer l'URL lors de la fermeture
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(null);
      setError(null);
    }

    // Nettoyage lors du démontage
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, document, toast]);

  const handleDownload = () => {
    if (document) {
      onDownload(document.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {document?.name}
          </DialogTitle>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={!document || (!document.content && !document.file_path)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger</span>
          </Button>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Chargement du document...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-destructive">
                <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                <p className="mb-4">{error}</p>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le fichier
                </Button>
              </div>
            </div>
          ) : document?.type?.toLowerCase() === 'pdf' && pdfUrl ? (
            <PDFViewer fileUrl={pdfUrl} fileName={document.name} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="mb-4">L'aperçu n'est pas disponible pour ce type de document.</p>
                <p className="text-sm text-muted-foreground mb-6">Veuillez télécharger le fichier pour le consulter.</p>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le fichier
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
