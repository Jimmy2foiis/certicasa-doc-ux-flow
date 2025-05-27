
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Package, Download, UploadIcon, RefreshCcw, Filter } from "lucide-react";

interface ClientsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClient: () => void;
  onCreateBatch: () => void;
  onAddToExistingBatch: () => void;
  onDownloadZip: () => void;
  onRefresh: () => void;
  selectedClientsCount: number;
}

const ClientsHeader = ({
  searchTerm,
  onSearchChange,
  onCreateClient,
  onCreateBatch,
  onAddToExistingBatch,
  onDownloadZip,
  onRefresh,
  selectedClientsCount
}: ClientsHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-50 pb-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              className="pl-9 w-64 bg-white"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button 
            onClick={onCreateClient} 
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>
      
      {/* Boutons d'action principale */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1 text-sm h-9 border-gray-300"
            disabled={selectedClientsCount === 0}
            onClick={onCreateBatch}
          >
            <UploadIcon className="h-4 w-4" />
            <span>Créer un lot</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1 text-sm h-9 border-gray-300"
            disabled={selectedClientsCount === 0}
            onClick={onAddToExistingBatch}
          >
            <Package className="h-4 w-4" />
            <span>Ajouter à un lot</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1 text-sm h-9 border-gray-300"
            disabled={selectedClientsCount === 0}
            onClick={onDownloadZip}
          >
            <Download className="h-4 w-4" />
            <span>Exporter sélection</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 h-9 text-gray-600"
            onClick={onRefresh}
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Actualiser</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 h-9 text-gray-600"
          >
            <Filter className="h-4 w-4" />
            <span>Enregistrer filtre</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientsHeader;
