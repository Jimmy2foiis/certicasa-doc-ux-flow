
import { Plus, UploadIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientCreateDialog from "./ClientCreateDialog";

interface ClientsActionsProps {
  onClientCreated: () => Promise<void>;
  selectedCount: number;
}

const ClientsActions = ({ onClientCreated, selectedCount }: ClientsActionsProps) => {
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
        >
          <UploadIcon className="h-4 w-4" />
          <span>Créer dépôt de lot</span>
        </Button>
        
        <Button 
          variant="outline"
          disabled={selectedCount === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Exporter sélection</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientsActions;
