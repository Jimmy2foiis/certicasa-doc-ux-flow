import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, MoreVertical, Plus, Search, Download } from "lucide-react";
import { useState } from "react";

// Définition des types
type LotStatus = "preparation" | "envoye" | "validation" | "valide" | "rejete";
interface Lot {
  id: string;
  nom: string;
  delegataire: string;
  nbClients: number;
  dateDepot: string;
  status: LotStatus;
}

// Données de démonstration
const mockLots: Lot[] = [{
  id: "lot-001",
  nom: "Lot Madrid Centre",
  delegataire: "Eiffage",
  nbClients: 5,
  dateDepot: "2025-04-15",
  status: "validation"
}, {
  id: "lot-002",
  nom: "Lot Barcelone Sud",
  delegataire: "Certinergie",
  nbClients: 8,
  dateDepot: "2025-04-10",
  status: "envoye"
}, {
  id: "lot-003",
  nom: "Lot Séville Est",
  delegataire: "Eiffage",
  nbClients: 3,
  dateDepot: "2025-04-05",
  status: "valide"
}, {
  id: "lot-004",
  nom: "Lot Valence Ouest",
  delegataire: "Certinergie",
  nbClients: 6,
  dateDepot: "2025-04-01",
  status: "rejete"
}, {
  id: "lot-005",
  nom: "Lot Madrid Nord",
  delegataire: "Eiffage",
  nbClients: 4,
  dateDepot: "2025-03-28",
  status: "preparation"
}];

// Fonction pour obtenir la couleur et le texte selon le statut
const getStatusBadge = (status: LotStatus) => {
  switch (status) {
    case "preparation":
      return {
        color: "gray",
        label: "En préparation"
      };
    case "envoye":
      return {
        color: "blue",
        label: "Envoyé"
      };
    case "validation":
      return {
        color: "yellow",
        label: "En validation"
      };
    case "valide":
      return {
        color: "green",
        label: "Validé"
      };
    case "rejete":
      return {
        color: "red",
        label: "Rejeté"
      };
  }
};
const LotsManagement = () => {
  const [search, setSearch] = useState("");
  const [filteredLots, setFilteredLots] = useState<Lot[]>(mockLots);
  const handleSearch = (term: string) => {
    setSearch(term);
    if (!term.trim()) {
      setFilteredLots(mockLots);
      return;
    }
    const filtered = mockLots.filter(lot => lot.nom.toLowerCase().includes(term.toLowerCase()) || lot.delegataire.toLowerCase().includes(term.toLowerCase()));
    setFilteredLots(filtered);
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dépôt des Lots</h1>
          <p className="text-gray-500">
            Gérez les lots de projets déposés auprès des délégataires CAE
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Lot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau lot</DialogTitle>
              <DialogDescription>
                Entrez les détails du nouveau lot à déposer auprès d'un délégataire.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="delegataire" className="text-right">
                  Délégataire
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un délégataire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eiffage">Eiffage</SelectItem>
                    <SelectItem value="certinergie">Certinergie</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Créer lot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Lots de Projets</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Rechercher un lot..." className="pl-9 w-full rounded-md border-gray-300" value={search} onChange={e => handleSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du lot</TableHead>
                <TableHead>Délégataire</TableHead>
                <TableHead className="text-center">Clients</TableHead>
                <TableHead className="text-center">Date dépôt</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map(lot => {
              const statusBadge = getStatusBadge(lot.status);
              return <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.nom}</TableCell>
                    <TableCell>{lot.delegataire}</TableCell>
                    <TableCell className="text-center">{lot.nbClients}</TableCell>
                    <TableCell className="text-center">
                      {new Date(lot.dateDepot).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusBadge.color as any}>
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Voir détails</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            <span>Exporter ZIP</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>;
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};
export default LotsManagement;