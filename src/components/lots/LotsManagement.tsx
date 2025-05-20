
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Eye, 
  Download, 
  MoreHorizontal, 
  Edit, 
  ChevronDown,
  Users,
  Upload
} from "lucide-react";

// Données fictives pour les lots
const lotsData = [
  {
    id: "lot-001",
    name: "Lot Paris Mai 2025",
    delegataire: "Eiffage",
    nombreClients: 12,
    dateDépôt: "15/05/2025",
    statut: "En validation",
  },
  {
    id: "lot-002",
    name: "Lot Lyon Avril 2025",
    delegataire: "Certinergie",
    nombreClients: 8,
    dateDépôt: "28/04/2025",
    statut: "Validé",
  },
  {
    id: "lot-003",
    name: "Lot Marseille Mars 2025",
    delegataire: "Eiffage",
    nombreClients: 15,
    dateDépôt: "10/03/2025",
    statut: "Rejeté",
  },
  {
    id: "lot-004",
    name: "Lot Bordeaux Mai 2025",
    delegataire: "Certinergie",
    nombreClients: 6,
    dateDépôt: "05/05/2025",
    statut: "En préparation",
  },
  {
    id: "lot-005",
    name: "Lot Lille Avril 2025",
    delegataire: "Eiffage",
    nombreClients: 9,
    dateDépôt: "20/04/2025",
    statut: "Envoyé",
  }
];

const LotsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLots = lotsData.filter(lot => 
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.delegataire.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "En préparation":
        return "outline";
      case "Envoyé":
        return "default";
      case "En validation":
        return "secondary";
      case "Validé":
        return "success";
      case "Rejeté":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dépôt des Lots</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Lot
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestion des lots déposés</CardTitle>
          <CardDescription>
            Gérez les lots de projets déposés auprès des délégataires CAE
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un lot..."
                className="pl-9 w-full max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    Délégataire
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Tous</DropdownMenuItem>
                  <DropdownMenuItem>Eiffage</DropdownMenuItem>
                  <DropdownMenuItem>Certinergie</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    Statut
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Tous</DropdownMenuItem>
                  <DropdownMenuItem>En préparation</DropdownMenuItem>
                  <DropdownMenuItem>Envoyé</DropdownMenuItem>
                  <DropdownMenuItem>En validation</DropdownMenuItem>
                  <DropdownMenuItem>Validé</DropdownMenuItem>
                  <DropdownMenuItem>Rejeté</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du lot</TableHead>
                  <TableHead>Délégataire</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Date dépôt</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLots.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.name}</TableCell>
                    <TableCell>{lot.delegataire}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        {lot.nombreClients}
                      </div>
                    </TableCell>
                    <TableCell>{lot.dateDépôt}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(lot.statut)}>
                        {lot.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              <span>Gérer les clients</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Upload className="mr-2 h-4 w-4" />
                              <span>Changer le statut</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instructions pour les délégataires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800">Processus de validation</h3>
              <p className="text-sm text-blue-700 mt-1">
                Les lots soumis aux délégataires CAE suivent un processus de validation en 5 étapes :
                En préparation → Envoyé → En validation → Validé/Rejeté
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-md">
              <h3 className="font-medium text-amber-800">⚠️ Attention</h3>
              <p className="text-sm text-amber-700 mt-1">
                Le statut des clients est automatiquement synchronisé avec celui de leur lot.
                Si un lot est rejeté, tous les clients du lot seront marqués en statut "Rejeté".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LotsManagement;
