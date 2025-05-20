
import React from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateUploadAreaProps {
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TemplateUploadArea = ({ uploading, onChange }: TemplateUploadAreaProps) => {
  // Référence à l'élément input file
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fonction pour déclencher le clic sur l'input file
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        className="hidden"
        accept=".docx,.pdf"
        multiple
        onChange={onChange}
        disabled={uploading}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-lg font-medium mb-1">
          Glissez-déposez ou cliquez pour téléverser
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Format supporté: .docx, .pdf
        </p>
        <Button 
          type="button"
          disabled={uploading} 
          onClick={handleButtonClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          Sélectionner des fichiers
        </Button>
      </label>
    </div>
  );
};

export default TemplateUploadArea;
