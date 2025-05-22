
import { useState, useEffect } from "react";
import { prisma } from "../lib/prisma";
import { useToast } from "@/components/ui/use-toast";
import { FilesType, FoldersKey, Status } from '@prisma/client';

export interface ClientFile {
  id: string;
  name: string | null;
  fileId: string;
  fileUrl: string;
  folderType: FoldersKey;
  fileType: FilesType;
  createdAt: Date;
  updatedAt: Date;
  subFolderName?: string | null;
}

export interface ClientFileCategory {
  key: FoldersKey;
  label: string;
  count: number;
  files: ClientFile[];
}

// Map folder types to human-readable labels
const folderLabels: Record<FoldersKey, string> = {
  FICHA: "Fiches",
  DR_AYUDA: "Demandes d'aide",
  FACTURAS: "Factures",
  INFORMES_FOTOGRAFICOS: "Rapports photographiques",
  CERTIFICADO_INSTALADOR: "Certificats d'installation",
  CEEE: "CEEE",
  ACUERDO_CESION_DE_AHORROS: "Accord cession d'économies",
  DNI_CLIENT: "DNI Client",
  SIGNATURE: "Signatures",
  PHOTOS: "Photos"
};

export const useClientFiles = (beetoolToken: string) => {
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [categories, setCategories] = useState<ClientFileCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all files for a client
  useEffect(() => {
    const fetchFiles = async () => {
      if (!beetoolToken) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate the API response
        const response = await fetch(`/api/clients/${beetoolToken}/files`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch client files");
        }
        
        const data = await response.json();
        setFiles(data);
        
        // Group files by category
        const groupedFiles: Record<FoldersKey, ClientFile[]> = {} as Record<FoldersKey, ClientFile[]>;
        
        // Initialize all categories with empty arrays
        Object.values(FoldersKey).forEach(key => {
          groupedFiles[key as FoldersKey] = [];
        });
        
        // Group files by folderType
        data.forEach((file: ClientFile) => {
          if (groupedFiles[file.folderType]) {
            groupedFiles[file.folderType].push(file);
          }
        });
        
        // Convert to array of categories
        const categoryArray: ClientFileCategory[] = Object.entries(groupedFiles)
          .map(([key, files]) => ({
            key: key as FoldersKey,
            label: folderLabels[key as FoldersKey] || key,
            count: files.length,
            files
          }))
          .filter(category => category.count > 0) // Only include categories with files
          .sort((a, b) => b.count - a.count); // Sort by count descending
          
        setCategories(categoryArray);
      } catch (err) {
        console.error("Error fetching client files:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les fichiers du client",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [beetoolToken, toast]);

  // Function to refresh files
  const refreshFiles = async () => {
    setLoading(true);
    try {
      // Implementation similar to useEffect above
      // This would be an API call in a real implementation
      const response = await fetch(`/api/clients/${beetoolToken}/files?refresh=true`);
      
      if (!response.ok) {
        throw new Error("Failed to refresh client files");
      }
      
      const data = await response.json();
      setFiles(data);
      
      // Group files by category (same logic as above)
      // ...
      
      toast({
        title: "Succès",
        description: "Fichiers actualisés avec succès",
      });
    } catch (err) {
      console.error("Error refreshing files:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'actualiser les fichiers",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    categories,
    loading,
    error,
    refreshFiles,
  };
};
