
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Client } from "@/types/clientTypes";
import ClientForm from "./ClientForm";
import { useClientCreate } from "@/hooks/useClientCreate";

interface ClientCreateDialogProps {
  onClientCreated: () => Promise<void>;
}

const ClientCreateDialog = ({ onClientCreated }: ClientCreateDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { createClient, isCreating } = useClientCreate({
    onClientCreated,
    onSuccess: () => setOpenDialog(false)
  });

  const handleCreateClient = async (clientData: Client) => {
    await createClient(clientData);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          <span>Nouveau Client</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau client.
          </DialogDescription>
        </DialogHeader>
        
        <ClientForm 
          onSubmit={handleCreateClient} 
          onCancel={() => setOpenDialog(false)}
          isSubmitting={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreateDialog;
