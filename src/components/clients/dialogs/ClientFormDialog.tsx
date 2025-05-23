
import { useState } from "react";
import { Client } from "@/types/clientTypes";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClientForm from "../ClientForm";

interface ClientFormDialogProps {
  client?: Client | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdated: () => void;
  triggerButton?: boolean;
}

const ClientFormDialog = ({ 
  client, 
  isOpen, 
  onOpenChange, 
  onClientUpdated,
  triggerButton = true 
}: ClientFormDialogProps) => {
  const handleCloseForm = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Client
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{client ? "Modifier Client" : "Ajouter un Client"}</DialogTitle>
          <DialogDescription>
            {client ? "Modifiez les informations du client." : "Entrez les informations du nouveau client ici."}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          client={client}
          onClientUpdated={onClientUpdated}
          onClose={handleCloseForm}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
