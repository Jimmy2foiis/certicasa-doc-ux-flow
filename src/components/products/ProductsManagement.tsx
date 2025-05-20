
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Warehouse, Search, Plus, ArrowLeftRight, FileText } from "lucide-react";

// Type definitions
type ProductType = "soufflé" | "panneau" | "rouleau";

interface Product {
  id: string;
  nom: string;
  reference: string;
  conductivite: number;
  resistance: number;
  epaisseur: number;
  type: ProductType;
  prix: number;
}

interface Depot {
  id: string;
  nom: string;
  adresse: string;
}

interface Stock {
  depotId: string;
  productId: string;
  quantite: number;
}

interface StockMovement {
  id: string;
  date: string;
  type: "approvisionnement" | "transfert" | "utilisation";
  depotSource?: string;
  depotDestination?: string;
  produitId: string;
  quantite: number;
  description: string;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "prod-001",
    nom: "Laine de verre soufflée R8",
    reference: "LVS-R8",
    conductivite: 0.04,
    resistance: 8,
    epaisseur: 320,
    type: "soufflé",
    prix: 12.5
  },
  {
    id: "prod-002",
    nom: "Panneau isolant rigide R5",
    reference: "PIR-R5",
    conductivite: 0.022,
    resistance: 5,
    epaisseur: 110,
    type: "panneau",
    prix: 18.75
  },
  {
    id: "prod-003",
    nom: "Laine de roche en rouleau R3",
    reference: "LDR-R3",
    conductivite: 0.035,
    resistance: 3,
    epaisseur: 105,
    type: "rouleau",
    prix: 8.95
  }
];

const mockDepots: Depot[] = [
  { id: "dep-001", nom: "Dépôt Madrid", adresse: "Calle Principal 123, Madrid" },
  { id: "dep-002", nom: "Dépôt Séville", adresse: "Avenida Central 45, Séville" }
];

const mockStocks: Stock[] = [
  { depotId: "dep-001", productId: "prod-001", quantite: 150 },
  { depotId: "dep-001", productId: "prod-002", quantite: 75 },
  { depotId: "dep-001", productId: "prod-003", quantite: 200 },
  { depotId: "dep-002", productId: "prod-001", quantite: 80 },
  { depotId: "dep-002", productId: "prod-002", quantite: 120 },
  { depotId: "dep-002", productId: "prod-003", quantite: 90 }
];

const mockMovements: StockMovement[] = [
  {
    id: "mov-001",
    date: "2025-04-18",
    type: "approvisionnement",
    produitId: "prod-001",
    depotDestination: "dep-001",
    quantite: 50,
    description: "Livraison fournisseur"
  },
  {
    id: "mov-002",
    date: "2025-04-17",
    type: "transfert",
    depotSource: "dep-001",
    depotDestination: "dep-002",
    produitId: "prod-002",
    quantite: 25,
    description: "Rééquilibrage stock"
  },
  {
    id: "mov-003",
    date: "2025-04-15",
    type: "utilisation",
    depotSource: "dep-001",
    produitId: "prod-003",
    quantite: 15,
    description: "Projet #12458"
  }
];

const ProductsManagement = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedDepot, setSelectedDepot] = useState<string | null>(null);

  // Filter products based on search
  const filteredProducts = mockProducts.filter(product => 
    product.nom.toLowerCase().includes(searchProduct.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Get stock for the selected depot
  const getStockForProduct = (productId: string, depotId: string): number => {
    const stockItem = mockStocks.find(
      item => item.productId === productId && item.depotId === depotId
    );
    return stockItem?.quantite || 0;
  };

  // Format a number to display with fixed decimal places
  const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals);
  };

  // Get type label in French
  const getTypeLabel = (type: ProductType): string => {
    switch(type) {
      case "soufflé": return "Soufflé";
      case "panneau": return "Panneau";
      case "rouleau": return "Rouleau";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Produits & Stock</h1>
          <p className="text-gray-500">
            Gérez vos produits d'isolation et votre stock
          </p>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
          <TabsTrigger value="products" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span>Produits</span>
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center">
            <Warehouse className="mr-2 h-4 w-4" />
            <span>Stock et Logistique</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab content for Products */}
        <TabsContent value="products">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Produits d'Isolation</CardTitle>
                <div className="flex gap-4 items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher un produit..."
                      className="pl-9 w-full rounded-md border-gray-300"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau Produit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                        <DialogDescription>
                          Créez un nouveau produit d'isolation pour votre catalogue
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nom" className="text-right">Nom</Label>
                          <Input id="nom" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reference" className="text-right">Référence</Label>
                          <Input id="reference" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="type" className="text-right">Type</Label>
                          <Select>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="soufflé">Soufflé</SelectItem>
                              <SelectItem value="panneau">Panneau</SelectItem>
                              <SelectItem value="rouleau">Rouleau</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="conductivite" className="text-right">Conductivité λ (W/m·K)</Label>
                          <Input id="conductivite" type="number" step="0.001" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="resistance" className="text-right">Résistance R (m²·K/W)</Label>
                          <Input id="resistance" type="number" step="0.1" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="epaisseur" className="text-right">Épaisseur (mm)</Label>
                          <Input id="epaisseur" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="prix" className="text-right">Prix (€/m²)</Label>
                          <Input id="prix" type="number" step="0.01" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Ajouter le produit</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">λ (W/m·K)</TableHead>
                    <TableHead className="text-center">R (m²·K/W)</TableHead>
                    <TableHead className="text-center">Épaisseur (mm)</TableHead>
                    <TableHead className="text-right">Prix HT (€/m²)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.nom}</TableCell>
                      <TableCell>{product.reference}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{getTypeLabel(product.type)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{formatNumber(product.conductivite, 3)}</TableCell>
                      <TableCell className="text-center">{formatNumber(product.resistance, 1)}</TableCell>
                      <TableCell className="text-center">{product.epaisseur}</TableCell>
                      <TableCell className="text-right">{formatNumber(product.prix)} €</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab content for Stock & Logistics */}
        <TabsContent value="stock">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock par Dépôt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="depot-select">Sélectionner un dépôt</Label>
                    <Select value={selectedDepot || ""} onValueChange={setSelectedDepot}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un dépôt" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDepots.map(depot => (
                          <SelectItem key={depot.id} value={depot.id}>{depot.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedDepot && (
                    <div className="pt-4">
                      <h3 className="text-lg font-medium mb-3">
                        {mockDepots.find(d => d.id === selectedDepot)?.nom || ""}
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead className="text-center">Référence</TableHead>
                            <TableHead className="text-right">Quantité</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.nom}</TableCell>
                              <TableCell className="text-center">{product.reference}</TableCell>
                              <TableCell className="text-right">
                                {getStockForProduct(product.id, selectedDepot)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-6 space-x-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Plus className="mr-2 h-4 w-4" />
                              Approvisionner le stock
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approvisionner le stock</DialogTitle>
                              <DialogDescription>
                                Ajouter des produits au dépôt sélectionné
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Produit</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un produit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockProducts.map(product => (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.nom}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="quantity">Quantité</Label>
                                <Input id="quantity" type="number" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input id="notes" placeholder="Livraison fournisseur..." />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Confirmer</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <ArrowLeftRight className="mr-2 h-4 w-4" />
                              Transférer entre dépôts
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transférer des produits</DialogTitle>
                              <DialogDescription>
                                Transférer des produits entre deux dépôts
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Dépôt source</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Dépôt d'origine" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockDepots.map(depot => (
                                      <SelectItem key={depot.id} value={depot.id}>
                                        {depot.nom}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Dépôt destination</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Dépôt de destination" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockDepots.map(depot => (
                                      <SelectItem key={depot.id} value={depot.id}>
                                        {depot.nom}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Produit</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un produit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockProducts.map(product => (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.nom}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="transfer-quantity">Quantité</Label>
                                <Input id="transfer-quantity" type="number" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Confirmer le transfert</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des mouvements</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMovements.map((movement) => {
                      const product = mockProducts.find(p => p.id === movement.produitId);
                      const typeLabel = movement.type === "approvisionnement" 
                        ? "Approvisionnement" 
                        : movement.type === "transfert" 
                          ? "Transfert" 
                          : "Utilisation";
                      
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {new Date(movement.date).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                movement.type === "approvisionnement" 
                                  ? "outline" 
                                  : movement.type === "transfert" 
                                    ? "secondary" 
                                    : "default"
                              }
                            >
                              {typeLabel}
                            </Badge>
                          </TableCell>
                          <TableCell>{product?.nom}</TableCell>
                          <TableCell className="text-right">{movement.quantite}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsManagement;
