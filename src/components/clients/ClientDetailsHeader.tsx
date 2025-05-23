import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import ClientForm from "./ClientForm";
import { Client } from "@/types";

interface ClientDetailsHeaderProps {
  client: Client;
  onClientSave?: (client: Client) => void;
}

export function ClientDetailsHeader({ client, onClientSave }: ClientDetailsHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-bold">{client.firstName} {client.lastName}</h2>
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          Retour
        </Button>
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1.5" />
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client. Cliquez sur enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          
          <ClientForm
            client={client}
            onSubmitSuccess={() => {
              setIsEditDialogOpen(false);
              if (onClientSave) onClientSave(client);
            }}
            submitButtonText="Enregistrer les modifications"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
