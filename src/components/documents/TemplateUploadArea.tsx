
import React from "react";
import { Upload, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateUploadAreaProps {
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  supportedFormats?: string[];
}

const TemplateUploadArea = ({ 
  uploading, 
  onChange,
  supportedFormats = ['.docx', '.pdf']
}: TemplateUploadAreaProps) => {
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
      e.currentTarget.classList.add('border-primary', 'bg-primary/5');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    
    if (uploading) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Vérifier si les fichiers déposés sont du type accepté
      const files = Array.from(e.dataTransfer.files);
      const acceptedFormats = supportedFormats.map(f => f.replace('.', ''));
      
      const allFilesValid = files.every(file => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        return acceptedFormats.includes(extension);
      });
      
      if (allFilesValid) {
        // Création d'un event synthétique pour réutiliser le handler existant
        const syntheticEvent = {
          target: {
            files: e.dataTransfer.files,
            value: ''
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        
        onChange(syntheticEvent);
      } else {
        // Afficher un message d'erreur ou autre feedback
        console.error("Un ou plusieurs fichiers ne sont pas d'un format accepté");
        alert(`Format(s) accepté(s): ${supportedFormats.join(', ')}`);
      }
    }
  };

  // Formats d'acceptation pour l'input file
  const acceptString = supportedFormats.join(',');

  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 transition-colors duration-200 ${
        uploading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:border-primary hover:bg-primary/5'
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
        onChange={onChange}
        disabled={uploading}
      />
      <div className="flex flex-col items-center justify-center">
        {uploading ? (
          <div className="animate-pulse">
            <Upload className="h-12 w-12 text-primary mb-2" />
            <p className="text-lg font-medium mb-1">
              Téléchargement en cours...
            </p>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-lg font-medium mb-1">
              Glissez-déposez ou cliquez pour téléverser
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Formats supportés: {supportedFormats.join(', ')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {supportedFormats.map(format => (
                <Badge key={format} variant="outline" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {format}
                </Badge>
              ))}
            </div>
            <Button 
              type="button"
              disabled={uploading} 
            >
              <Plus className="mr-2 h-4 w-4" />
              Sélectionner des fichiers
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateUploadArea;
