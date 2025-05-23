import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, fileName }) => {
  // Plugin pour un affichage avec layout par défaut (zoom, pagination, etc.)
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-full bg-white rounded border border-gray-200">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          renderError={(error) => (
            <div className="p-4 text-center">
              <p className="text-destructive font-medium">Erreur lors du chargement du PDF</p>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          )}
        />
      </Worker>
    </div>
  );
};
