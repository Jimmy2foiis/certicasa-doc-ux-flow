
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientRecord, Client } from "@/services/supabaseService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddressInput } from "@/components/address/AddressInput";
import { ApiStatus } from "@/components/address/ApiStatus";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";
import { useCoordinates } from "@/hooks/useCoordinates";

// Define validation schema
const clientSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer un email valide" }).optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[0-9+\s()-]{6,20}$/, { message: "Format de téléphone invalide" })
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  nif: z.string()
    .regex(/^[0-9A-Z]{9}$/, { message: "Le NIF doit contenir 9 caractères alphanumériques" })
    .optional()
    .or(z.literal('')),
  type: z.string().optional().or(z.literal(''))
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientCreateDialogProps {
  onClientCreated: () => Promise<void>;
}

const ClientCreateDialog = ({ onClientCreated }: ClientCreateDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { coordinates, setClientCoordinates } = useCoordinates();
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      nif: "",
      type: "010"
    }
  });

  // Handle address selection from Google Maps autocomplete
  const handleAddressSelected = (address: string) => {
    form.setValue("address", address);
    form.trigger("address");
    setShowSuggestions(false);
  };
  
  // Initialize Google Maps Autocomplete
  const { isLoading, error, apiAvailable, initAutocomplete } = useGoogleMapsAutocomplete({
    inputRef: addressInputRef,
    initialAddress: form.getValues("address"),
    onAddressSelected: handleAddressSelected,
    onCoordinatesSelected: setClientCoordinates
  });

  // Initialize autocomplete when dialog opens
  useEffect(() => {
    if (openDialog && addressInputRef.current && apiAvailable) {
      initAutocomplete();
    }
  }, [openDialog, apiAvailable, initAutocomplete]);

  const handleCreateClient = async (data: ClientFormValues) => {
    try {
      // Create a Client object ensuring name is not undefined
      const clientData: Client = {
        name: data.name, // This is required and validated by zod
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        nif: data.nif || undefined,
        type: data.type || "010",
      };
      
      const createdClient = await createClientRecord(clientData);
      
      if (createdClient) {
        toast({
          title: "Client créé",
          description: `Le client ${createdClient.name} a été créé avec succès.`,
        });
        
        // Reset form and close dialog
        form.reset();
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateClient)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: +34 612 345 678" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AddressInput
                        ref={addressInputRef}
                        {...field}
                        isLoading={isLoading}
                        placeholder="Saisissez une adresse espagnole..."
                      />
                    </div>
                  </FormControl>
                  {error && (
                    <div className="text-red-500 text-xs mt-1">{error}</div>
                  )}
                  <ApiStatus 
                    isLoading={isLoading}
                    apiAvailable={apiAvailable}
                    className="mt-1"
                    message={isLoading ? "Chargement de la recherche d'adresse..." : undefined}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: A12345678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setOpenDialog(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer le client
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreateDialog;
