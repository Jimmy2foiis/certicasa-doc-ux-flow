
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getBatches, addClientsToBatch } from "@/services/api/batchService";
import { Badge } from "@/components/ui/badge";

interface Batch {
  id: string;
  name: string;
  status: string;
  client_count: number;
  created_at: string;
}

interface AddToExistingBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClientIds: string[];
  onClientsAdded?: () => void;
}

const AddToExistingBatchDialog = ({ open, onOpenChange, selectedClientIds, onClientsAdded }: AddToExistingBatchDialogProps) => {
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadBatches();
    }
  }, [open]);

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const batchList = await getBatches();
      // Filtrer seulement les lots en cours de préparation
      const activeBatches = batchList.filter(batch => 
        batch.status === "En cours de dépôt" || batch.status === "preparation"
      );
      setBatches(activeBatches);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les lots",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToLot = async () => {
    if (!selectedBatchId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un lot",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      const success = await addClientsToBatch(selectedBatchId, selectedClientIds);
      if (success) {
        const selectedBatch = batches.find(b => b.id === selectedBatchId);
        toast({
          title: "Clients ajoutés",
          description: `${selectedClientIds.length} client(s) ajouté(s) au lot "${selectedBatch?.name}"`,
        });
        setSelectedBatchId("");
        onOpenChange(false);
        if (onClientsAdded) {
          onClientsAdded();
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les clients au lot",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter à un lot existant</DialogTitle>
          <DialogDescription>
            Sélectionnez un lot existant pour y ajouter {selectedClientIds.length} client(s).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedBatchId} onValueChange={setSelectedBatchId} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un lot"} />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{batch.name}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="secondary" className="text-xs">
                        {batch.client_count} clients
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {batch.status}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {batches.length === 0 && !isLoading && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun lot disponible pour l'ajout de clients
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleAddToLot} 
            disabled={isAdding || !selectedBatchId}
            className="bg-green-600 hover:bg-green-700"
          >
            {isAdding ? "Ajout..." : "Ajouter au lot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToExistingBatchDialog;
