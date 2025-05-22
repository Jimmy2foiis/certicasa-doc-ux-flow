
import { useState, useEffect } from "react";
import { useClientFiles, ClientFile } from "@/hooks/useClientFiles";
import { ClientFilesCategories } from "./ClientFilesCategories";
import { ClientFileViewer } from "./ClientFileViewer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Upload, FolderPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EnhancedDocumentsTabProps {
  beetoolToken: string;
  clientName: string;
}

const EnhancedDocumentsTab = ({ 
  beetoolToken,
  clientName
}: EnhancedDocumentsTabProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<ClientFile | null>(null);
  const [isFileViewOpen, setIsFileViewOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  const {
    categories,
    loading,
    error,
    refreshFiles
  } = useClientFiles(beetoolToken);
  
  // Filter categories based on search query
  const filteredCategories = categories.map(category => ({
    ...category,
    files: category.files.filter(file => 
      !searchQuery || 
      (file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      file.folderType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.fileType.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.files.length > 0);
  
  // Handle file view
  const handleViewFile = (file: ClientFile) => {
    setSelectedFile(file);
    setIsFileViewOpen(true);
  };
  
  // Handle file download
  const handleDownloadFile = (file: ClientFile) => {
    // Replace with actual download logic
    toast({
      title: "Téléchargement démarré",
      description: `Téléchargement de ${file.name || "fichier"} en cours...`
    });
    
    // Simulate download completion
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: `${file.name || "Fichier"} téléchargé avec succès`
      });
    }, 2000);
  };
  
  // Handle folder view in Google Drive
  const handleViewGoogleFolder = (folderType: string) => {
    // Replace with actual Google Drive folder URL logic
    toast({
      title: "Redirection",
      description: "Ouverture du dossier dans Google Drive..."
    });
    
    // Simulate opening Google Drive folder
    // In production, this would open the actual Google Drive folder URL
    window.open("https://drive.google.com", "_blank");
  };
  
  // Display total file count
  const totalFiles = categories.reduce(
    (total, category) => total + category.files.length, 
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              {totalFiles} fichiers disponibles pour {clientName}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={refreshFiles}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <ClientFilesCategories
          categories={filteredCategories}
          loading={loading}
          onViewFile={handleViewFile}
          onDownloadFile={handleDownloadFile}
          onViewGoogleFolder={handleViewGoogleFolder}
        />
        
        <ClientFileViewer
          file={selectedFile}
          isOpen={isFileViewOpen}
          onClose={() => setIsFileViewOpen(false)}
          onDownload={handleDownloadFile}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedDocumentsTab;
