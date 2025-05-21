
import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
}

export const PDFViewer = ({ fileUrl, fileName }: PDFViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]], // Only show thumbnails tab
  });

  useEffect(() => {
    // Vérifier si l'URL est valide
    const checkUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Si le fileUrl est vide ou invalide
        if (!fileUrl) {
          throw new Error("L'URL du fichier PDF est vide ou invalide");
        }
        
        // Si c'est une URL de données (base64), on vérifie son format
        if (fileUrl.startsWith('data:')) {
          // Vérifier si c'est une URL de données PDF valide
          if (!fileUrl.startsWith('data:application/pdf') && !fileUrl.includes('pdf')) {
            throw new Error("Le format du fichier ne semble pas être un PDF valide");
          }
          
          // Vérifier la longueur minimale d'un PDF en base64 (doit être assez long)
          if (fileUrl.length < 1000) { // Un PDF même vide en base64 est plus long que ça
            throw new Error("Le contenu du PDF semble être incomplet ou corrompu");
          }
          
          setLoading(false);
          return;
        }
        
        // Pour les URLs blob ou http, essayons de les récupérer
        if (fileUrl.startsWith('blob:') || fileUrl.startsWith('http')) {
          const response = await fetch(fileUrl, { method: 'HEAD' });
          
          if (!response.ok) {
            throw new Error(`Impossible d'accéder au fichier PDF (${response.status}: ${response.statusText})`);
          }
          
          // Pour des URLs HTTP, vérifier aussi le Content-Type
          if (fileUrl.startsWith('http')) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && !contentType.includes('pdf')) {
              console.warn(`Le type de contenu '${contentType}' ne correspond pas à un PDF`);
            }
          }
          
          setLoading(false);
          return;
        }
        
        // Si ce n'est ni une URL de données ni une URL blob/http, c'est probablement invalide
        throw new Error("Le format de l'URL du fichier PDF n'est pas reconnu");
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'URL du PDF:', err);
        setError(err instanceof Error ? err.message : 'Impossible de charger le PDF');
        setLoading(false);
      }
    };
    
    checkUrl();
    
    return () => {
      // Nettoyer les URLs de type blob
      if (fileUrl && fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  // Gestionnaire pour le chargement réussi
  const handleDocumentLoad = () => {
    setLoading(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p>Chargement du PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
        <p className="text-center text-muted-foreground mb-4">{error}</p>
        {fileUrl && (
          <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')}>
            Télécharger le PDF
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-full">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1}
            onDocumentLoad={handleDocumentLoad}
            renderError={(error: Error) => {
              return (
                <div className="flex flex-col items-center justify-center h-full p-5">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-lg font-medium mb-2">Erreur d'affichage du PDF</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {error.message || "Le document PDF n'a pas pu être affiché"}
                  </p>
                  <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')}>
                    Télécharger le PDF
                  </Button>
                </div>
              );
            }}
          />
        </div>
      </Worker>
    </div>
  );
};
