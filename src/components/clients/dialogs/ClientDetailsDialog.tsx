
import { Client } from "@/types/clientTypes";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientDetails from "../ClientDetails";

interface ClientDetailsDialogProps {
  client: Client | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClientDetailsDialog = ({ client, isOpen, onOpenChange }: ClientDetailsDialogProps) => {
  const handleCloseDetails = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Détails du Client</DialogTitle>
          <DialogDescription>
            Informations complètes sur le client sélectionné.
          </DialogDescription>
        </DialogHeader>
        <ClientDetails client={client} onClose={handleCloseDetails} />
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
