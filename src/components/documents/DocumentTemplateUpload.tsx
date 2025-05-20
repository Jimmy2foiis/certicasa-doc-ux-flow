import { useState, useEffect } from "react";
import { Upload, FileText, Plus, FileCheck, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UploadedFile extends File {
  id: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  dateUploaded: string;
}

// Clé localStorage pour stocker les modèles de documents
export const DOCUMENT_TEMPLATES_KEY = 'document_templates';

const DocumentTemplateUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger les modèles existants depuis le localStorage au chargement
  useEffect(() => {
    // Nous les chargeons juste pour afficher un message d'information
    const existingTemplates = loadTemplatesFromStorage();
    if (existingTemplates.length > 0) {
      toast({
        title: "Modèles disponibles",
        description: `${existingTemplates.length} modèle(s) sont disponibles dans votre bibliothèque.`,
      });
    }
  }, [toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Validation - only accept .docx or .pdf files
    const validFiles: UploadedFile[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(files).forEach(file => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'docx' || fileExt === 'pdf') {
        validFiles.push({
          ...file,
          id: `${file.name}-${Date.now()}`,
          progress: 0,
          status: 'uploading'
        });
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
      
      // Simulate upload progress for each file
      validFiles.forEach(file => {
        simulateFileUpload(file.id);
      });
    }
    
    // Reset file input
    e.target.value = '';
  };
  
  // Simulate file upload with progress
  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, progress: 100, status: 'complete' } 
              : file
          )
        );
        
        // Check if all files are complete
        const allComplete = uploadedFiles.every(file => 
          file.id === fileId ? true : file.status === 'complete'
        );
        
        if (allComplete) {
          setUploading(false);
          toast({
            title: "Modèles téléversés avec succès",
            description: "Tous les modèles ont été ajoutés avec succès.",
          });
        }
      } else {
        setUploadedFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, progress: Math.min(progress, 99) } 
              : file
          )
        );
      }
    }, 200);
  };
  
  const confirmDeleteFile = (fileId: string) => {
    setFileToDelete(fileId);
  };
  
  const handleDeleteFile = () => {
    if (fileToDelete) {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileToDelete));
      
      toast({
        title: "Modèle supprimé",
        description: "Le modèle a été supprimé avec succès.",
      });
      
      setFileToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setFileToDelete(null);
  };

  // Charger les modèles depuis le localStorage
  const loadTemplatesFromStorage = (): DocumentTemplate[] => {
    try {
      const storedTemplates = localStorage.getItem(DOCUMENT_TEMPLATES_KEY);
      if (storedTemplates) {
        return JSON.parse(storedTemplates);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
    }
    return [];
  };
  
  // Enregistrer les modèles dans le localStorage
  const saveTemplateToStorage = (templates: DocumentTemplate[]) => {
    try {
      localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modèles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modèles. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const saveAllTemplates = () => {
    // Convertir les fichiers téléversés en modèles de documents
    const now = new Date().toLocaleDateString('fr-FR');
    
    const newTemplates: DocumentTemplate[] = uploadedFiles
      .filter(file => file.status === 'complete')
      .map(file => ({
        id: file.id,
        name: file.name.replace(/\.[^/.]+$/, ""), // Enlever l'extension
        type: file.name.split('.').pop() || "unknown",
        lastModified: now,
        dateUploaded: now
      }));
    
    // Charger les modèles existants et ajouter les nouveaux
    const existingTemplates = loadTemplatesFromStorage();
    const mergedTemplates = [...existingTemplates, ...newTemplates];
    
    // Sauvegarder dans localStorage
    saveTemplateToStorage(mergedTemplates);
    
    // Notification
    toast({
      title: "Modèles enregistrés",
      description: `${newTemplates.length} modèle(s) ont été ajoutés à la bibliothèque.`,
    });
    
    // Réinitialiser l'état pour permettre de nouveaux téléversements
    setUploadedFiles([]);
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
            <ScrollArea className="h-[250px] rounded">
              <div className="space-y-3 pr-3">
                <h3 className="text-sm font-medium mb-2">Fichiers téléversés</h3>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
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
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => confirmDeleteFile(file.id)}
                        disabled={file.status === 'uploading'}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-gray-500 mt-1">
                          Téléversement en cours... {Math.round(file.progress)}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <AlertDialog open={!!fileToDelete} onOpenChange={cancelDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le modèle</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce modèle ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteFile}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
      
      {uploadedFiles.length > 0 && (
        <CardFooter>
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {uploadedFiles.length} modèle(s) téléversé(s)
            </p>
            <Button onClick={saveAllTemplates}>
              Enregistrer dans la bibliothèque
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentTemplateUpload;
