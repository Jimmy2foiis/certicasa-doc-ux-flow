
import { useState } from "react";
import { Upload, FileText, Plus, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const DocumentTemplateUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Validation - only accept .docx or .pdf files
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(files).forEach(file => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'docx' || fileExt === 'pdf') {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Format de fichier non supporté",
        description: `Les fichiers suivants ne sont pas au format .docx ou .pdf: ${invalidFiles.join(', ')}`,
        variant: "destructive"
      });
    }
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "Modèles téléversés avec succès",
        description: `${validFiles.length} modèle(s) ajouté(s) avec succès.`,
      });
    }
    
    setUploading(false);
    // Reset file input
    e.target.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Téléverser des modèles</CardTitle>
        <CardDescription>
          Téléversez des modèles Word (.docx) ou PDF interactifs pour la génération de documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".docx,.pdf"
              multiple
              onChange={handleFileUpload}
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
              <Button disabled={uploading}>
                <Plus className="mr-2 h-4 w-4" />
                Sélectionner des fichiers
              </Button>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Fichiers téléversés</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center bg-green-50 border border-green-200 rounded-md p-3"
                  >
                    <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplateUpload;
