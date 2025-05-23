
import { Plus, UploadIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientCreateDialog from "./ClientCreateDialog";
import { useToast } from "@/components/ui/use-toast";

interface ClientsActionsProps {
  onClientCreated: () => Promise<void>;
  selectedCount: number;
  onCreateBatch?: () => void;
  onExportSelection?: () => void;
}

const ClientsActions = ({ 
  onClientCreated, 
  selectedCount,
  onCreateBatch,
  onExportSelection
}: ClientsActionsProps) => {
  const { toast } = useToast();
  
  const handleCreateBatch = () => {
    if (selectedCount === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un client pour créer un lot",
        variant: "destructive"
      });
      return;
    }
    
    if (onCreateBatch) {
      onCreateBatch();
    } else {
      console.log("Création de lot avec", selectedCount, "clients");
      toast({
        title: "Création de lot",
        description: `Lot créé avec ${selectedCount} client(s)`,
      });
    }
  };
  
  const handleExportSelection = () => {
    if (selectedCount === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un client pour exporter",
        variant: "destructive"
      });
      return;
    }
    
    if (onExportSelection) {
      onExportSelection();
    } else {
      console.log("Exportation de", selectedCount, "clients");
      toast({
        title: "Exportation",
        description: `${selectedCount} client(s) exporté(s) avec succès`,
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        {selectedCount > 0 && (
          <span className="text-sm text-gray-500">
            {selectedCount} client{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <ClientCreateDialog onClientCreated={onClientCreated} />
        
        <Button 
          variant="outline"
          disabled={selectedCount === 0}
          className="flex items-center gap-2"
          onClick={handleCreateBatch}
        >
          <UploadIcon className="h-4 w-4" />
          <span>Créer dépôt de lot</span>
        </Button>
        
        <Button 
          variant="outline"
          disabled={selectedCount === 0}
          className="flex items-center gap-2"
          onClick={handleExportSelection}
        >
          <Download className="h-4 w-4" />
          <span>Exporter sélection</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientsActions;
