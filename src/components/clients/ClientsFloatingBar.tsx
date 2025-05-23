
import { UploadIcon, FolderPlus, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ClientsFloatingBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  selectedClientIds: string[];
  onCreateBatch?: () => void;
  onAddToExistingBatch?: () => void;
  onDownloadZip?: () => void;
}

const ClientsFloatingBar = ({ 
  selectedCount, 
  onClearSelection,
  selectedClientIds,
  onCreateBatch,
  onAddToExistingBatch,
  onDownloadZip
}: ClientsFloatingBarProps) => {
  const { toast } = useToast();

  const handleCreateBatch = () => {
    if (onCreateBatch) {
      onCreateBatch();
    } else {
      console.log("Création d'un lot avec les clients:", selectedClientIds);
      toast({
        title: "Création de lot",
        description: `Lot créé avec ${selectedCount} client(s)`,
      });
    }
  };

  const handleAddToExistingBatch = () => {
    if (onAddToExistingBatch) {
      onAddToExistingBatch();
    } else {
      console.log("Ajout à un lot existant des clients:", selectedClientIds);
      toast({
        title: "Ajout au lot",
        description: `${selectedCount} client(s) ajouté(s) au lot existant`,
      });
    }
  };

  const handleDownloadZip = () => {
    if (onDownloadZip) {
      onDownloadZip();
    } else {
      console.log("Téléchargement ZIP des clients:", selectedClientIds);
      toast({
        title: "Téléchargement",
        description: `Fichier ZIP contenant les données de ${selectedCount} client(s) préparé`,
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 flex items-center gap-2 border border-gray-200 z-50">
      <span className="font-medium text-sm">
        {selectedCount} client{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
      </span>
      
      <div className="h-4 border-r border-gray-300 mx-1"></div>
      
      <Button size="sm" variant="default" onClick={handleCreateBatch} className="flex items-center gap-1">
        <UploadIcon className="h-3.5 w-3.5" />
        <span>Créer dépôt de lot</span>
      </Button>
      
      <Button size="sm" variant="outline" onClick={handleAddToExistingBatch} className="flex items-center gap-1">
        <FolderPlus className="h-3.5 w-3.5" />
        <span>Ajouter à un lot existant</span>
      </Button>
      
      <Button size="sm" variant="outline" onClick={handleDownloadZip} className="flex items-center gap-1">
        <Download className="h-3.5 w-3.5" />
        <span>Télécharger ZIP</span>
      </Button>
      
      <Button size="sm" variant="ghost" onClick={onClearSelection} className="flex items-center gap-1">
        <X className="h-3.5 w-3.5" />
        <span>Désélectionner</span>
      </Button>
    </div>
  );
};

export default ClientsFloatingBar;
