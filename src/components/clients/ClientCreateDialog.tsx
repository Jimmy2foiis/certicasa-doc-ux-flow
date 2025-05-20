
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientRecord, Client } from "@/services/supabaseService";
import ClientForm from "./ClientForm";

interface ClientCreateDialogProps {
  onClientCreated: () => Promise<void>;
}

const ClientCreateDialog = ({ onClientCreated }: ClientCreateDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateClient = async (clientData: Client) => {
    try {
      const createdClient = await createClientRecord(clientData);
      
      if (createdClient) {
        toast({
          title: "Client créé",
          description: `Le client ${createdClient.name} a été créé avec succès.`,
        });
        
        // Close dialog
        setOpenDialog(false);
        
        // Reload client list
        await onClientCreated();
      }
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le client. Veuillez réessayer.",
        variant: "destructive",
      });
    }
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
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreateDialog;
