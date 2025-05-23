import React, { useState } from 'react';
import { Upload, Plus, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TemplateUploadAreaProps {
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  supportedFormats?: string[];
}

const TemplateUploadArea = ({
  uploading,
  onChange,
  supportedFormats = ['.docx', '.pdf'],
}: TemplateUploadAreaProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Référence à l'élément input file
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fonction pour déclencher le clic sur l'input file
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fonction pour gérer le drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (uploading) return;
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Vérifier si les fichiers déposés sont du type accepté
      const files = Array.from(e.dataTransfer.files);
      const acceptedFormats = supportedFormats.map((f) => f.replace('.', ''));

      const invalidFiles = files.filter((file) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        return !acceptedFormats.includes(extension);
      });

      if (invalidFiles.length > 0) {
        const invalidNames = invalidFiles.map((f) => f.name).join(', ');
        setError(
          `Format(s) non accepté(s): ${invalidNames}. Formats supportés: ${supportedFormats.join(', ')}`,
        );
        return;
      }

      // Création d'un event synthétique pour réutiliser le handler existant
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files,
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  // Gestion du changement de fichier via input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    onChange(e);
  };

  // Formats d'acceptation pour l'input file
  const acceptString = supportedFormats.join(',');

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          uploading
            ? 'border-gray-300 bg-gray-50 opacity-75 cursor-not-allowed'
            : dragActive
              ? 'border-primary bg-primary/5 cursor-pointer'
              : 'border-gray-300 bg-gray-50 cursor-pointer hover:border-primary hover:bg-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={uploading ? undefined : handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptString}
          multiple
          onChange={handleChange}
          disabled={uploading}
        />
        <div className="flex flex-col items-center justify-center">
          {uploading ? (
            <div className="animate-pulse">
              <Upload className="h-12 w-12 text-primary mb-2" />
              <p className="text-lg font-medium mb-1">Extraction et analyse en cours...</p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-medium mb-1">Glissez-déposez ou cliquez pour téléverser</p>
              <p className="text-sm text-gray-500 mb-4">
                Formats supportés: {supportedFormats.join(', ')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {supportedFormats.map((format) => (
                  <Badge key={format} variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {format}
                  </Badge>
                ))}
              </div>
              <Button type="button" disabled={uploading}>
                <Plus className="mr-2 h-4 w-4" />
                Sélectionner des fichiers
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateUploadArea;
