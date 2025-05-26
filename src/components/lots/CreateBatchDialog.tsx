
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createBatch } from "@/services/api/batchService";

interface CreateBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClientIds: string[];
  onBatchCreated?: () => void;
}

const CreateBatchDialog = ({ open, onOpenChange, selectedClientIds, onBatchCreated }: CreateBatchDialogProps) => {
  const [batchName, setBatchName] = useState("");
  const [delegataire, setDelegataire] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!batchName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du lot est requis",
        variant: "destructive"
      });
      return;
    }

    if (!delegataire) {
      toast({
        title: "Erreur", 
        description: "Veuillez sélectionner un délégataire",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const newBatch = await createBatch(batchName, selectedClientIds);
      if (newBatch) {
        toast({
          title: "Lot créé",
          description: `Le lot "${batchName}" a été créé avec ${selectedClientIds.length} client(s)`,
        });
        setBatchName("");
        setDelegataire("");
        onOpenChange(false);
        if (onBatchCreated) {
          onBatchCreated();
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le lot",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau lot</DialogTitle>
          <DialogDescription>
            Entrez les détails du nouveau lot avec {selectedClientIds.length} client(s) sélectionné(s).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom du lot
            </Label>
            <Input 
              id="name" 
              className="col-span-3" 
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="ex: Lot Madrid Centre"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="delegataire" className="text-right">
              Délégataire
            </Label>
            <Select value={delegataire} onValueChange={setDelegataire}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un délégataire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eiffage">Eiffage</SelectItem>
                <SelectItem value="certinergie">Certinergie</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCreating ? "Création..." : "Créer le lot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBatchDialog;
