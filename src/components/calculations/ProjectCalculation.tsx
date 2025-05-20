
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Save, 
  Plus,
  Trash2,
  ArrowRight
} from "lucide-react";
import LayerRow from "./LayerRow";

interface ProjectCalculationProps {
  clientId?: string;
}

const initialLayers = [
  { id: "1", material: "Enlucido de yeso", thickness: 15, lambda: 0.3, r: 0.05 },
  { id: "2", material: "Ladrillo cerámico", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "3", material: "Cámara de aire", thickness: 50, lambda: "-", r: 0.18 },
  { id: "4", material: "Ladrillo cerámico", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "5", material: "Enlucido de yeso", thickness: 15, lambda: 0.3, r: 0.05 }
];

const ProjectCalculation = ({ clientId }: ProjectCalculationProps) => {
  const [beforeLayers, setBeforeLayers] = useState(initialLayers);
  const [afterLayers, setAfterLayers] = useState([
    ...initialLayers,
    { id: "6", material: "Aislante EPS", thickness: 80, lambda: 0.031, r: 2.58 }
  ]);
  
  const [projectType, setProjectType] = useState("RES010");
  const [ventilationType, setVentilationType] = useState("natural");
  const [surfaceArea, setSurfaceArea] = useState("127");

  // Cálculo de la resistencia térmica total antes
  const totalRBefore = beforeLayers.reduce((sum, layer) => sum + layer.r, 0.17); // Incluir Rsi + Rse (0.17)
  const uValueBefore = 1 / totalRBefore;
  
  // Cálculo de la resistencia térmica total después
  const totalRAfter = afterLayers.reduce((sum, layer) => sum + layer.r, 0.17); // Incluir Rsi + Rse (0.17)
  const uValueAfter = 1 / totalRAfter;
  
  // Calculo del porcentaje de mejora
  const improvementPercent = ((uValueBefore - uValueAfter) / uValueBefore) * 100;
  
  // Determinar si cumple con los requisitos
  const meetsRequirements = improvementPercent >= 30;
  
  // Calcular el ratio B (ejemplo simplificado)
  const bRatio = 0.95; // Simplificado para el ejemplo
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Tipo de proyecto</Label>
              <Select 
                value={projectType}
                onValueChange={setProjectType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RES010">RES010 - Envolvente térmica</SelectItem>
                  <SelectItem value="RES020">RES020 - Instalaciones térmicas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surfaceArea">Superficie a intervenir (m²)</Label>
              <Input
                id="surfaceArea"
                value={surfaceArea}
                onChange={(e) => setSurfaceArea(e.target.value)}
                type="number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ventilationType">Tipo de ventilación</Label>
              <Select 
                value={ventilationType}
                onValueChange={setVentilationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ventilación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Ventilación natural</SelectItem>
                  <SelectItem value="mechanical">Ventilación mecánica</SelectItem>
                  <SelectItem value="hybrid">Ventilación híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 space-y-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Coeficiente B:</span>
                <span className="font-medium">{bRatio.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Mejora U-value:</span>
                <span className="font-medium">{improvementPercent.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Resulta:</span>
                <Badge variant={meetsRequirements ? "success" : "destructive"}>
                  {meetsRequirements ? "Cumple" : "No cumple"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium">Categoría:</span>
                <Badge>{projectType}</Badge>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cálculos
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Módulo de Cálculo</CardTitle>
            <CardDescription>
              Ingresa los materiales y espesores para calcular la resistencia térmica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bloque "Antes de los trabajos" */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Antes de los trabajos</h3>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir capa
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="w-[120px]">Espesor (mm)</TableHead>
                      <TableHead className="w-[120px]">λ (W/mK)</TableHead>
                      <TableHead className="w-[120px]">R (m²K/W)</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beforeLayers.map((layer) => (
                      <LayerRow 
                        key={layer.id} 
                        layer={layer}
                        onDelete={() => {
                          setBeforeLayers(beforeLayers.filter(l => l.id !== layer.id));
                        }}
                      />
                    ))}
                  </TableBody>
                </Table>
                
                <div className="p-3 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Resistencia térmica total (incluyendo Rsi + Rse):</span>
                      <span className="ml-2 font-medium">{totalRBefore.toFixed(2)} m²K/W</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Transmitancia U:</span>
                      <span className="ml-2 font-medium">{uValueBefore.toFixed(2)} W/m²K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bloque "Después de los trabajos" */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                <div className="flex items-center">
                  <h3 className="font-medium">Después de los trabajos</h3>
                  <ArrowRight className="h-4 w-4 mx-2 text-green-600" />
                  <Badge variant="success" className="ml-1">Mejora: {improvementPercent.toFixed(1)}%</Badge>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir capa
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="w-[120px]">Espesor (mm)</TableHead>
                      <TableHead className="w-[120px]">λ (W/mK)</TableHead>
                      <TableHead className="w-[120px]">R (m²K/W)</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {afterLayers.map((layer) => (
                      <LayerRow 
                        key={layer.id} 
                        layer={layer}
                        onDelete={() => {
                          setAfterLayers(afterLayers.filter(l => l.id !== layer.id));
                        }}
                        isNew={layer.id === "6"}
                      />
                    ))}
                  </TableBody>
                </Table>
                
                <div className="p-3 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Resistencia térmica total (incluyendo Rsi + Rse):</span>
                      <span className="ml-2 font-medium">{totalRAfter.toFixed(2)} m²K/W</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Transmitancia U:</span>
                      <span className="ml-2 font-medium">{uValueAfter.toFixed(2)} W/m²K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectCalculation;
