
import { useState } from "react";
import { ClientFileCategory, ClientFile } from "@/hooks/useClientFiles";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, Eye, Download, ExternalLink, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientFilesCategoriesProps {
  categories: ClientFileCategory[];
  loading: boolean;
  onViewFile: (file: ClientFile) => void;
  onDownloadFile: (file: ClientFile) => void;
  onViewGoogleFolder?: (folderType: string) => void;
}

// Function to get the appropriate icon based on fileType
const getFileTypeIcon = (fileType: string) => {
  // You could expand this with more icons based on file types
  return <FileIcon className="h-4 w-4" />;
};

// File item component for consistent rendering
const FileItem = ({ file, onView, onDownload }: { 
  file: ClientFile, 
  onView: () => void, 
  onDownload: () => void 
}) => (
  <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-md">
    <div className="flex items-center gap-3">
      {getFileTypeIcon(file.fileType)}
      <div>
        <p className="font-medium">{file.name || `Fichier ${file.fileId}`}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(file.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onView} title="Voir le fichier">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDownload} title="Télécharger">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => window.open(file.fileUrl, '_blank')} title="Ouvrir dans Google Drive">
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

// Empty state component
const EmptyCategory = () => (
  <div className="py-8 text-center">
    <p className="text-muted-foreground">Aucun fichier dans cette catégorie</p>
  </div>
);

// Loading state component
const LoadingState = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center justify-between p-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
          <div>
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-3 w-24 mt-1 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export const ClientFilesCategories = ({
  categories,
  loading,
  onViewFile,
  onDownloadFile,
  onViewGoogleFolder
}: ClientFilesCategoriesProps) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  
  // Handle accordion change
  const handleAccordionChange = (value: string) => {
    if (openCategories.includes(value)) {
      setOpenCategories(openCategories.filter((item) => item !== value));
    } else {
      setOpenCategories([...openCategories, value]);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <LoadingState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Accordion
      type="multiple"
      value={openCategories}
      className="space-y-4"
    >
      {categories.map((category) => (
        <AccordionItem
          key={category.key}
          value={category.key}
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger 
            className={cn(
              "px-4 py-2 hover:no-underline hover:bg-muted/30",
              openCategories.includes(category.key) ? "bg-muted/30" : ""
            )}
            onClick={() => handleAccordionChange(category.key)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <FolderOpen className="h-5 w-5 text-primary" />
                <span>{category.label}</span>
              </div>
              <Badge variant="outline" className="mr-2">
                {category.count}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            {category.files.length > 0 ? (
              <div className="space-y-1">
                {category.files.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    onView={() => onViewFile(file)}
                    onDownload={() => onDownloadFile(file)}
                  />
                ))}
                {onViewGoogleFolder && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => onViewGoogleFolder(category.key)}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Voir tous les fichiers dans Google Drive
                  </Button>
                )}
              </div>
            ) : (
              <EmptyCategory />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
      
      {categories.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">Aucun fichier disponible</p>
          </CardContent>
        </Card>
      )}
    </Accordion>
  );
};
