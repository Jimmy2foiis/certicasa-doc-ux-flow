
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Edit, 
  Trash2, 
  ChevronDown,
  Truck,
  ArrowRightLeft,
  Bell,
  Package
} from "lucide-react";

// Données fictives pour les produits
const productsData = [
  {
    id: "prod-001",
    nom: "SOUFL'R 47",
    reference: "SR47-200",
    conductivite: 0.047,
    resistance: 5.5,
    epaisseur: 259,
    type: "Soufflé",
    prixUnitaire: 18.75,
  },
  {
    id: "prod-002",
    nom: "ISOL+ Premium",
    reference: "IP-100",
    conductivite: 0.035,
    resistance: 2.85,
    epaisseur: 100,
    type: "Panneau",
    prixUnitaire: 15.40,
  },
  {
    id: "prod-003",
    nom: "ThermoLaine",
    reference: "TL-080",
    conductivite: 0.040,
    resistance: 2.00,
    epaisseur: 80,
    type: "Rouleau",
    prixUnitaire: 9.25,
  },
  {
    id: "prod-004",
    nom: "EcoFibre",
    reference: "EF-150",
    conductivite: 0.042,
    resistance: 3.57,
    epaisseur: 150,
    type: "Soufflé",
    prixUnitaire: 12.80,
  }
];

// Données fictives pour le stock
const stockData = [
  {
    productId: "prod-001",
    productName: "SOUFL'R 47",
    reference: "SR47-200",
    depot: "Madrid",
    quantite: 85,
  },
  {
    productId: "prod-001",
    productName: "SOUFL'R 47",
    reference: "SR47-200",
    depot: "Séville",
    quantite: 32,
  },
  {
    productId: "prod-002",
    productName: "ISOL+ Premium",
    reference: "IP-100",
    depot: "Madrid",
    quantite: 140,
  },
  {
    productId: "prod-003",
    productName: "ThermoLaine",
    reference: "TL-080",
    depot: "Madrid",
    quantite: 56,
  },
  {
    productId: "prod-003",
    productName: "ThermoLaine",
    reference: "TL-080",
    depot: "Barcelone",
    quantite: 27,
  },
  {
    productId: "prod-004",
    productName: "EcoFibre",
    reference: "EF-150",
    depot: "Séville",
    quantite: 5,
  },
];

// Données fictives pour les mouvements
const movementsData = [
  {
    id: "mvt-001",
    date: "18/05/2025",
    produit: "SOUFL'R 47",
    type: "Approvisionnement",
    depotSource: "-",
    depotDest: "Madrid",
    quantite: 50,
  },
  {
    id: "mvt-002",
    date: "15/05/2025",
    produit: "ISOL+ Premium",
    type: "Transfert",
    depotSource: "Madrid",
    depotDest: "Séville",
    quantite: 25,
  },
  {
    id: "mvt-003",
    date: "10/05/2025",
    produit: "ThermoLaine",
    type: "Utilisation Projet",
    depotSource: "Madrid",
    depotDest: "Projet #12445",
    quantite: 18,
  },
];

const ProductsManagement = () => {
  const [searchProducts, setSearchProducts] = useState("");
  const [searchStock, setSearchStock] = useState("");
  
  const filteredProducts = productsData.filter(product => 
    product.nom.toLowerCase().includes(searchProducts.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchProducts.toLowerCase())
  );
  
  const filteredStock = stockData.filter(item => 
    item.productName.toLowerCase().includes(searchStock.toLowerCase()) ||
    item.depot.toLowerCase().includes(searchStock.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Produits & Logistique</h1>
      </div>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
          <TabsTrigger value="products">Produits d'Isolation</TabsTrigger>
          <TabsTrigger value="inventory">Gestion Stock</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <CardTitle>Catalogue des Produits d'Isolation</CardTitle>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                <span>Nouveau Produit</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Rechercher un produit..."
                    className="pl-9 w-full max-w-sm"
                    value={searchProducts}
                    onChange={(e) => setSearchProducts(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        Type
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Tous</DropdownMenuItem>
                      <DropdownMenuItem>Soufflé</DropdownMenuItem>
                      <DropdownMenuItem>Panneau</DropdownMenuItem>
                      <DropdownMenuItem>Rouleau</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>λ (W/m·K)</TableHead>
                      <TableHead>R (m²·K/W)</TableHead>
                      <TableHead>Épaisseur (mm)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Prix HT (€/m²)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.nom}</TableCell>
                        <TableCell>{product.reference}</TableCell>
                        <TableCell>{product.conductivite}</TableCell>
                        <TableCell>{product.resistance}</TableCell>
                        <TableCell>{product.epaisseur}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.type}</Badge>
                        </TableCell>
                        <TableCell>{product.prixUnitaire.toFixed(2)} €</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-md">
                <h3 className="font-medium text-amber-800">Intégration avec les calculs</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Les produits définis ici sont automatiquement disponibles dans les modules de calcul RES010/RES020.
                  Lorsqu'un matériau est sélectionné, ses caractéristiques (lambda, résistance, épaisseur) s'appliquent automatiquement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <div>
                <CardTitle>Gestion des Stocks</CardTitle>
                <CardDescription>Suivi des stocks par dépôt</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Approvisionner</span>
                </Button>
                <Button variant="outline" className="flex items-center">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  <span>Transférer</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Rechercher un article ou dépôt..."
                    className="pl-9 w-full max-w-sm"
                    value={searchStock}
                    onChange={(e) => setSearchStock(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        Dépôt
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Tous</DropdownMenuItem>
                      <DropdownMenuItem>Madrid</DropdownMenuItem>
                      <DropdownMenuItem>Séville</DropdownMenuItem>
                      <DropdownMenuItem>Barcelone</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Dépôt</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStock.map((item, index) => (
                      <TableRow key={`${item.productId}-${item.depot}-${index}`}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.reference}</TableCell>
                        <TableCell>{item.depot}</TableCell>
                        <TableCell>
                          {item.quantite <= 10 ? (
                            <span className="flex items-center">
                              <Badge variant="destructive" className="mr-2">Alerte</Badge>
                              {item.quantite}
                            </span>
                          ) : (
                            item.quantite
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Ajuster
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 p-3 bg-red-50 rounded-md">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="text-sm font-medium text-red-700">Alertes de stock</h4>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  Le produit "EcoFibre" est en quantité critique à Séville (5 unités).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Mouvements</CardTitle>
              <CardDescription>
                Suivi des approvisionnements, transferts et utilisations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Origine</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Quantité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movementsData.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">{movement.date}</TableCell>
                        <TableCell>{movement.produit}</TableCell>
                        <TableCell>
                          <Badge variant={
                            movement.type === "Approvisionnement" ? "success" :
                            movement.type === "Transfert" ? "secondary" :
                            "default"
                          }>
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.depotSource}</TableCell>
                        <TableCell>{movement.depotDest}</TableCell>
                        <TableCell>{movement.quantite}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsManagement;
