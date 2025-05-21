
import { FileCheck, FileText, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadedFile } from "@/types/documents";

interface TemplateFileItemProps {
  file: UploadedFile;
  onDelete: (fileId: string) => void;
}

const TemplateFileItem = ({ file, onDelete }: TemplateFileItemProps) => {
  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (isNaN(bytes) || bytes === 0) return "0 KB";
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`flex flex-col border rounded-md p-3 ${
        file.status === 'complete' 
          ? 'bg-green-50 border-green-200' 
          : file.status === 'error'
            ? 'bg-red-50 border-red-200'
            : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {file.status === 'complete' ? (
            <FileCheck className="h-5 w-5 text-green-500 mr-2" />
          ) : file.status === 'error' ? (
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          ) : (
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
          )}
          <div>
            <p className="font-medium text-sm">{file.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(file.id)}
          disabled={file.status === 'uploading'}
        >
          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
        </Button>
      </div>
      
      {file.status === 'uploading' && (
        <div className="mt-2">
          <Progress value={file.progress} className="h-1" />
          <p className="text-xs text-gray-500 mt-1">
            Téléversement en cours... {Math.round(file.progress || 0)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateFileItem;
