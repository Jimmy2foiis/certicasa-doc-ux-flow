
import { UploadIcon, Package, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateBatchDialog from "@/components/lots/CreateBatchDialog";
import AddToExistingBatchDialog from "@/components/lots/AddToExistingBatchDialog";
import { useBatchActions } from "@/hooks/useBatchActions";

interface ClientsFloatingBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  selectedClientIds: string[];
  onBatchCreated?: () => void;
}

const ClientsFloatingBar = ({ 
  selectedCount, 
  onClearSelection,
  selectedClientIds,
  onBatchCreated
}: ClientsFloatingBarProps) => {
  const {
    showCreateDialog,
    setShowCreateDialog,
    showAddToExistingDialog,
    setShowAddToExistingDialog,
    handleCreateBatch,
    handleAddToExistingBatch,
    handleDownloadZip
  } = useBatchActions();

  // Calcul des statistiques sur les dossiers sélectionnés (simulation)
  const res010Count = Math.floor(selectedCount * 0.4);
  const res020Count = selectedCount - res010Count;
  const totalArea = Math.floor(selectedCount * 85);
  const missingDocs = Math.floor(selectedCount * 0.3);

  const onCreateBatchClick = () => {
    handleCreateBatch(selectedClientIds);
  };

  const onAddToExistingBatchClick = () => {
    handleAddToExistingBatch(selectedClientIds);
  };

  const onDownloadZipClick = () => {
    handleDownloadZip(selectedClientIds);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 flex items-center gap-2 border border-gray-200 z-50">
        <div className="flex flex-col mr-2">
          <span className="font-medium text-sm">
            {selectedCount} client{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
          </span>
          <span className="text-xs text-gray-500">
            {res010Count} RES010 / {res020Count} RES020 • {totalArea}m² total • {missingDocs} docs manquants
          </span>
        </div>
        
        <div className="h-10 border-r border-gray-300 mx-1"></div>
        
        <Button size="sm" variant="default" onClick={onCreateBatchClick} className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
          <UploadIcon className="h-3.5 w-3.5" />
          <span>Créer un lot</span>
        </Button>
        
        <Button size="sm" variant="outline" onClick={onAddToExistingBatchClick} className="flex items-center gap-1">
          <Package className="h-3.5 w-3.5" />
          <span>Ajouter à un lot</span>
        </Button>
        
        <Button size="sm" variant="outline" onClick={onDownloadZipClick} className="flex items-center gap-1">
          <Download className="h-3.5 w-3.5" />
          <span>Exporter sélection</span>
        </Button>
        
        <Button size="sm" variant="ghost" onClick={onClearSelection} className="flex items-center gap-1 ml-1">
          <X className="h-3.5 w-3.5" />
          <span>Désélectionner</span>
        </Button>
      </div>

      <CreateBatchDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        selectedClientIds={selectedClientIds}
        onBatchCreated={onBatchCreated}
      />

      <AddToExistingBatchDialog 
        open={showAddToExistingDialog}
        onOpenChange={setShowAddToExistingDialog}
        selectedClientIds={selectedClientIds}
        onClientsAdded={onBatchCreated}
      />
    </>
  );
};

export default ClientsFloatingBar;
