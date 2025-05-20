
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientRecord } from "@/services/supabaseService";
import { AddressInput } from "@/components/address/AddressInput";

interface ClientCreateDialogProps {
  onClientCreated: () => Promise<void>;
}

const ClientCreateDialog = ({ onClientCreated }: ClientCreateDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nif: "",
    type: "010"
  });

  const handleCreateClient = async () => {
    try {
      if (!newClient.name) {
        toast({
          title: "Erreur",
          description: "Le nom du client est obligatoire.",
          variant: "destructive",
        });
        return;
      }

      const createdClient = await createClientRecord(newClient);
      
      if (createdClient) {
        toast({
          title: "Client créé",
          description: `Le client ${createdClient.name} a été créé avec succès.`,
        });
        
        // Réinitialiser le formulaire et fermer la boîte de dialogue
        setNewClient({
          name: "",
          email: "",
          phone: "",
          address: "",
          nif: "",
          type: "010"
        });
        setOpenDialog(false);
        
        // Recharger la liste des clients
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

  // Mettre à jour les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };
  
  // Gérer l'adresse avec autocomplétion
  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewClient(prev => ({ ...prev, address: value }));
    
    if (value.length >= 3) {
      setAddressLoading(true);
      setShowSuggestions(true);
      
      try {
        // Simuler une recherche d'adresse (à remplacer par l'API réelle)
        // Ici on pourrait utiliser l'API Google Maps Autocomplete si disponible
        setTimeout(() => {
          const mockSuggestions = [
            `${value}, Calle Principal, Madrid, España`,
            `${value}, Avenida Central, Barcelona, España`,
            `${value}, Calle Mayor, Valencia, España`,
            `${value}, Plaza Principal, Sevilla, España`,
          ];
          setAddressSuggestions(mockSuggestions);
          setAddressLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erreur lors de la recherche d'adresse:", error);
        setAddressLoading(false);
        setShowSuggestions(false);
      }
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const selectAddressSuggestion = (address: string) => {
    setNewClient(prev => ({ ...prev, address }));
    setShowSuggestions(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          <span>Nouveau Client</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau client.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={newClient.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              name="email"
              value={newClient.email}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={newClient.phone}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Adresse</Label>
            <div className="col-span-3 relative">
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
                {addressLoading && <Loader2 className="absolute right-2.5 top-2.5 h-5 w-5 text-gray-400 animate-spin" />}
                <Input
                  id="address"
                  name="address"
                  value={newClient.address}
                  onChange={handleAddressChange}
                  className="pl-10"
                  placeholder="Saisissez une adresse..."
                />
              </div>
              
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 z-10 max-h-60 overflow-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectAddressSuggestion(suggestion)}
                    >
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                        <span>{suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nif" className="text-right">NIF</Label>
            <Input
              id="nif"
              name="nif"
              value={newClient.nif}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Input
              id="type"
              name="type"
              value={newClient.type}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreateClient}>
            Créer le client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreateDialog;
