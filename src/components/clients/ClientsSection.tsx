
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
import { useState as useHookState } from "react";

const ClientsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  
  // Formulaire nouveau client
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nif: "",
    type: "010"
  });

  // Charger les clients depuis Supabase
  const loadClients = async () => {
    try {
      setLoading(true);
      const clientData = await getClients();
      setClients(clientData);
      console.log("Clients chargés depuis Supabase:", clientData);
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
                    <Input
                      id="address"
                      name="address"
                      value={newClient.address}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
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
                          <Badge variant={client.status === "Actif" ? "success" : "outline"}>
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
