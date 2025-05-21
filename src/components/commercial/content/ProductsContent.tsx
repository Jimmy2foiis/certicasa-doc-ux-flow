
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ProductsContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produits & Stocks</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            Inventaire
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Nouveau Produit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Produits actifs</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-indigo-600">48</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Faible stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-amber-600">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rupture</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue de produits</CardTitle>
          <CardDescription>
            Gérez vos produits et suivez les niveaux de stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { ref: 'ISO-001', name: 'Isolant thermique standard', category: 'Isolation', stock: 24, status: 'En stock' },
                { ref: 'ISO-002', name: 'Isolant haute performance', category: 'Isolation', stock: 12, status: 'En stock' },
                { ref: 'FIX-001', name: 'Fixations standard', category: 'Fixations', stock: 87, status: 'En stock' },
                { ref: 'REV-001', name: 'Revêtement extérieur blanc', category: 'Revêtements', stock: 3, status: 'Stock faible' },
                { ref: 'REV-002', name: 'Revêtement extérieur gris', category: 'Revêtements', stock: 0, status: 'Rupture' }
              ].map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.ref}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock} unités</TableCell>
                  <TableCell>
                    <Badge className={
                      product.status === 'En stock' ? 'bg-green-100 text-green-800' :
                      product.status === 'Stock faible' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Éditer</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline">Voir tous les produits</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsContent;
