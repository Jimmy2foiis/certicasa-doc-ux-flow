
import { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Loader2,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getClients, createClientRecord, deleteClientRecord, Client } from "@/services/supabaseService";
import ClientDetails from "@/components/clients/ClientDetails";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AddressInput } from "@/components/address/AddressInput";

const ClientsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Formulaire nouveau client
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nif: "",
    type: "010"
  });

  // Charger les clients depuis Supabase et le stockage local
  const loadClients = async () => {
    try {
      setLoading(true);
      
      // Charger depuis Supabase
      const remoteClients = await getClients();
      
      // Charger depuis le stockage local
      const localClientsString = localStorage.getItem('local_clients');
      const localClients = localClientsString ? JSON.parse(localClientsString) : [];
      
      // Combiner les deux sources
      const allClients = [...remoteClients, ...localClients];
      
      setClients(allClients);
      console.log("Clients chargés:", allClients);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients depuis la base de données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les clients au montage du composant
  useEffect(() => {
    loadClients();
  }, []);

  // Filtrer les clients selon le terme de recherche
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  // Gérer la soumission du formulaire de création de client
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
        await loadClients();
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

  // Gérer la suppression d'un client
  const handleDeleteClient = async (clientId: string) => {
    try {
      // Si c'est un client local
      if (clientId.startsWith('local_')) {
        const localClientsString = localStorage.getItem('local_clients');
        if (localClientsString) {
          const localClients = JSON.parse(localClientsString);
          const updatedClients = localClients.filter((c: Client) => c.id !== clientId);
          localStorage.setItem('local_clients', JSON.stringify(updatedClients));
          
          toast({
            title: "Client supprimé",
            description: "Le client a été supprimé avec succès.",
          });
          
          // Recharger la liste des clients
          await loadClients();
        }
        return;
      }
      
      // Si c'est un client dans Supabase
      const success = await deleteClientRecord(clientId);
      
      if (success) {
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès.",
        });
        
        // Recharger la liste des clients
        await loadClients();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client. Veuillez réessayer.",
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
    <>
      {selectedClient ? (
        <ClientDetails 
          clientId={selectedClient} 
          onBack={() => setSelectedClient(null)} 
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">Clients</CardTitle>
            
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
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher un client..."
                  className="pl-9 w-full max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Statut
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Tous</DropdownMenuItem>
                    <DropdownMenuItem>Actifs</DropdownMenuItem>
                    <DropdownMenuItem>Inactifs</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Ville
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Toutes</DropdownMenuItem>
                    <DropdownMenuItem>Madrid</DropdownMenuItem>
                    <DropdownMenuItem>Barcelone</DropdownMenuItem>
                    <DropdownMenuItem>Valence</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Type
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Tous</DropdownMenuItem>
                    <DropdownMenuItem>RES010</DropdownMenuItem>
                    <DropdownMenuItem>RES020</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Projets</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          <span className="ml-2 text-gray-500">Chargement des clients...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-gray-500">Aucun client trouvé</p>
                        {searchTerm ? (
                          <p className="text-sm text-gray-400 mt-1">Essayez avec un autre terme de recherche</p>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setOpenDialog(true)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            <span>Ajouter un client</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow 
                        key={client.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => client.id && setSelectedClient(client.id)}
                      >
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.projects || 0}</TableCell>
                        <TableCell>
                          <Badge variant={client.status === "Actif" || client.status === "Activo" ? "success" : "outline"}>
                            {client.status === "Activo" ? "Actif" : client.status || "Actif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Modifier</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center text-red-600" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (client.id) handleDeleteClient(client.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ClientsSection;
