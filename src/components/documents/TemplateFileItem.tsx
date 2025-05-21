
import { useState } from "react";
import { FileText, X, AlertTriangle, Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { extractTemplateTags } from "@/components/documents/template-mapping/utils";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  progress: number;
  status: "uploading" | "complete" | "error";
  content: string | null;
  slice: any;
  stream: any;
  text: any;
  arrayBuffer: any;
}

interface TemplateFileItemProps {
  file: UploadedFile;
  onDelete: (id: string) => void;
}

const TemplateFileItem = ({ file, onDelete }: TemplateFileItemProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  
  // Extraire les balises du contenu
  const tags = file.content ? extractTemplateTags(file.content) : [];
  const hasValidTags = tags.length > 0;
  
  const handleDelete = () => {
    onDelete(file.id);
    setShowDeleteDialog(false);
  };
  
  const confirmDelete = () => {
    setShowDeleteDialog(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };
  
  const getStatusIcon = () => {
    if (file.status === "uploading") return null;
    if (file.status === "error") return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (file.status === "complete" && hasValidTags) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (file.status === "complete" && !hasValidTags) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  return (
    <div className="border rounded p-3 flex items-center justify-between bg-white">
      <div className="flex items-center flex-1 min-w-0">
        <div className="bg-blue-100 rounded p-2 mr-3">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="font-medium text-gray-900 truncate mr-2">{file.name}</p>
            {getStatusIcon()}
            {file.status === "complete" && (
              <Badge 
                variant={hasValidTags ? "outline" : "destructive"} 
                className="ml-2 cursor-pointer"
                onClick={() => setShowTagsDialog(true)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {hasValidTags ? `${tags.length} balise(s)` : "Aucune balise"}
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="mr-3">{formatFileSize(file.size)}</span>
            {file.status === "uploading" && (
              <span className="text-blue-600">{Math.round(file.progress)}%</span>
            )}
          </div>
          {file.status === "uploading" && (
            <Progress value={file.progress} className="h-1 mt-1" />
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={confirmDelete}
        disabled={file.status === "uploading"}
      >
        <X className="h-4 w-4" />
      </Button>
      
      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce fichier ?</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer le fichier "{file.name}" ?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog d'affichage des balises */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Balises détectées</DialogTitle>
          </DialogHeader>
          {hasValidTags ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                {tags.length} balise(s) trouvée(s) dans le document :
              </p>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <p>Aucune balise n'a été détectée dans ce document.</p>
              <p className="text-sm text-gray-500 mt-2">
                Assurez-vous que les variables sont au format {{variable}}.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowTagsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateFileItem;
