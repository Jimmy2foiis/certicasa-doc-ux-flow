
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  Euro, 
  Calculator, 
  FileCheck,
  ArrowRight
} from "lucide-react";

const Billing = () => {
  const [surface, setSurface] = useState("127");
  const [productPrice, setProductPrice] = useState("7");
  const [laborRate, setLaborRate] = useState("15");
  
  // Calculos de factura
  const surfaceValue = parseFloat(surface) || 0;
  const productPriceValue = parseFloat(productPrice) || 0;
  const laborRateValue = parseFloat(laborRate) || 0;
  
  const productTotal = surfaceValue * productPriceValue;
  const laborTotal = surfaceValue * laborRateValue;
  const subtotal = productTotal + laborTotal;
  const taxRate = 0.10; // 10% IVA
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Cálculo de Factura</CardTitle>
            <CardDescription>Basado en superficie y costes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="surface">Superficie total (m²)</Label>
              <div className="mt-1">
                <Input
                  id="surface"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  type="number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="product-price">Precio del material (€/m²)</Label>
              <div className="mt-1">
                <Input
                  id="product-price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="labor-rate">Coste de mano de obra (€/m²)</Label>
              <div className="mt-1">
                <Input
                  id="labor-rate"
                  value={laborRate}
                  onChange={(e) => setLaborRate(e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Aislante EPS:</span>
                <span className="font-medium">{productTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Mano de obra:</span>
                <span className="font-medium">{laborTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="font-medium">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">IVA (10%):</span>
                <span className="font-medium">{taxAmount.toFixed(2)} €</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-semibold text-lg">{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col gap-2">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <FileCheck className="mr-2 h-4 w-4" />
                Generar factura PDF
              </Button>
              <Button variant="outline" className="w-full">
                <Euro className="mr-2 h-4 w-4" />
                Registrar pago
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Vista previa de factura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-10 w-10 bg-emerald-500 text-white rounded flex items-center justify-center font-bold text-xl">
                    C
                  </div>
                  <h2 className="text-xl font-bold mt-2">CertiCasa Doc</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Calle Gran Vía 41, Planta 5</p>
                    <p>28013 Madrid, España</p>
                    <p>NIF: B-12345678</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-800">FACTURA</h3>
                  <p className="text-gray-600">#FAC-2023-428</p>
                  <p className="text-sm text-gray-500 mt-2">Fecha: 20/05/2023</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-600 mb-2">Cliente</h3>
                  <p className="font-medium">Juan Pérez Martínez</p>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Calle Serrano 120</p>
                    <p>28006 Madrid, España</p>
                    <p>NIF: X-1234567-Z</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-600 mb-2">Proyecto</h3>
                  <p className="font-medium">Rehabilitación energética fachada</p>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Ref: RES010-2023-127</p>
                    <p>Dirección: Calle Serrano 120, 28006 Madrid</p>
                    <p>Fecha de ejecución: 18/04/2023</p>
                  </div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Descripción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <p>Aislante EPS 80mm</p>
                      <p className="text-sm text-gray-500">Paneles de poliestireno expandido</p>
                    </TableCell>
                    <TableCell>{surface} m²</TableCell>
                    <TableCell>{productPrice} €/m²</TableCell>
                    <TableCell className="text-right">{productTotal.toFixed(2)} €</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <p>Mano de obra</p>
                      <p className="text-sm text-gray-500">Instalación y acabados</p>
                    </TableCell>
                    <TableCell>{surface} m²</TableCell>
                    <TableCell>{laborRate} €/m²</TableCell>
                    <TableCell className="text-right">{laborTotal.toFixed(2)} €</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="flex justify-end">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (10%):</span>
                    <span>{taxAmount.toFixed(2)} €</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>Forma de pago: Transferencia bancaria</p>
                    <p>IBAN: ES12 3456 7890 1234 5678 9012</p>
                    <p>Fecha límite de pago: 20/06/2023</p>
                  </div>
                  <div className="w-32 h-16 border-dashed border-2 border-gray-300 flex items-center justify-center text-gray-400">
                    <span className="text-xs">Firmado digitalmente</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="mx-1">
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button variant="outline" className="mx-1">
                <FileText className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
