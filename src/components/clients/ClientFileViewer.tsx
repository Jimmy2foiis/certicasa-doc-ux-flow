
import { useState, useCallback } from "react";
import { ClientFile } from "@/hooks/useClientFiles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClientFileViewerProps {
  file: ClientFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: ClientFile) => void;
}

export const ClientFileViewer = ({
  file,
  isOpen,
  onClose,
  onDownload
}: ClientFileViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Function to handle file download
  const handleDownload = useCallback(() => {
    if (!file) return;
    setLoading(true);
    
    onDownload(file);
    
    // Simulate download completion
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [file, onDownload]);

  if (!file) return null;

  // Check if file URL is a Google Drive URL
  const isGoogleDriveUrl = file.fileUrl.includes("drive.google.com");
  
  // Determine if file is viewable in iframe
  const isViewable = isGoogleDriveUrl || file.fileUrl.endsWith(".pdf");
  
  // Format Google Drive URL for embedding (view mode)
  const getEmbedUrl = (url: string) => {
    if (isGoogleDriveUrl) {
      // Extract file ID from Google Drive URL
      const match = url.match(/[-\w]{25,}/);
      if (match) {
        const fileId = match[0];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>{file.name || `Fichier ${file.fileId}`}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 mt-2">
            {isViewable ? (
              <div className="rounded-md border overflow-hidden h-[60vh]">
                <iframe
                  src={getEmbedUrl(file.fileUrl)}
                  className="w-full h-full"
                  title={file.name || "Document preview"}
                />
              </div>
            ) : (
              <Alert className="h-[60vh] flex items-center justify-center">
                <AlertDescription>
                  Ce type de document ne peut pas être prévisualisé directement.<br />
                  Veuillez le télécharger ou l'ouvrir dans Google Drive.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="mt-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Type de document</p>
                  <p className="text-sm">{file.folderType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Type de fichier</p>
                  <p className="text-sm">{file.fileType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date de création</p>
                  <p className="text-sm">{new Date(file.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dernière modification</p>
                  <p className="text-sm">{new Date(file.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">ID Fichier</p>
                  <p className="text-sm">{file.fileId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Sous-dossier</p>
                  <p className="text-sm">{file.subFolderName || "—"}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm font-medium">URL</p>
                <p className="text-sm break-all">{file.fileUrl}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => window.open(file.fileUrl, "_blank")}
            >
              Ouvrir dans Google Drive
            </Button>
            <Button onClick={handleDownload} disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Téléchargement..." : "Télécharger"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
