
import { useState, useEffect } from "react";
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
  ArrowRight
} from "lucide-react";
import LayerRow from "./LayerRow";
import MaterialSelector from "./MaterialSelector";
import { predefinedMaterials, Material } from "@/data/materials";
import { calculateBCoefficient, calculateThermalResistance, calculateUValue, VentilationType, BCoefficientParams } from "@/utils/calculationUtils";

interface ProjectCalculationProps {
  clientId?: string;
}

interface Layer extends Material {
  isNew?: boolean;
}

const initialLayers = [
  { id: "1", material: "Enduit de plâtre", thickness: 15, lambda: 0.3, r: 0.05 },
  { id: "2", material: "Brique céramique", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "3", material: "Lame d'air", thickness: 50, lambda: "-", r: 0.18 },
  { id: "4", material: "Brique céramique", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "5", material: "Enduit de plâtre", thickness: 15, lambda: 0.3, r: 0.05 }
];

const ProjectCalculation = ({ clientId }: ProjectCalculationProps) => {
  const [beforeLayers, setBeforeLayers] = useState<Layer[]>(initialLayers);
  const [afterLayers, setAfterLayers] = useState<Layer[]>([
    ...initialLayers,
    { id: "6", material: "Isolant EPS", thickness: 80, lambda: 0.031, r: 2.58, isNew: true }
  ]);
  
  const [projectType, setProjectType] = useState("RES010");
  const [ventilationType, setVentilationType] = useState<VentilationType>("caso1");
  const [surfaceArea, setSurfaceArea] = useState("127");
  const [ratioValue, setRatioValue] = useState(0.85);
  
  // Calcul du coefficient B
  const bCoefficientBefore = calculateBCoefficient({
    ratio: ratioValue,
    ventilationType,
    isAfterWork: false
  });
  
  const bCoefficientAfter = calculateBCoefficient({
    ratio: ratioValue,
    ventilationType,
    isAfterWork: true
  });

  // Calcul de la résistance thermique totale avant
  const totalRBefore = calculateThermalResistance(beforeLayers);
  const uValueBefore = calculateUValue(totalRBefore, bCoefficientBefore);
  
  // Calcul de la résistance thermique totale après
  const totalRAfter = calculateThermalResistance(afterLayers);
  const uValueAfter = calculateUValue(totalRAfter, bCoefficientAfter);
  
  // Calcul du pourcentage d'amélioration
  const improvementPercent = ((uValueBefore - uValueAfter) / uValueBefore) * 100;
  
  // Déterminer si les exigences sont satisfaites
  const meetsRequirements = improvementPercent >= 30;
  
  const addLayer = (layerSet: "before" | "after", material: Material) => {
    const newLayer = {
      ...material,
      id: Date.now().toString(),
      isNew: true
    };
    
    if (layerSet === "before") {
      setBeforeLayers([...beforeLayers, newLayer]);
    } else {
      setAfterLayers([...afterLayers, newLayer]);
    }
  };
  
  const updateLayer = (layerSet: "before" | "after", updatedLayer: Layer) => {
    if (layerSet === "before") {
      setBeforeLayers(beforeLayers.map(layer => 
        layer.id === updatedLayer.id ? updatedLayer : layer
      ));
    } else {
      setAfterLayers(afterLayers.map(layer => 
        layer.id === updatedLayer.id ? updatedLayer : layer
      ));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Information et B Coefficient */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Informations du Projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Type de projet</Label>
              <Select 
                value={projectType}
                onValueChange={setProjectType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RES010">RES010 - Enveloppe thermique</SelectItem>
                  <SelectItem value="RES020">RES020 - Installations thermiques</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surfaceArea">Superficie des combles (m²)</Label>
              <Input
                id="surfaceArea"
                value={surfaceArea}
                onChange={(e) => setSurfaceArea(e.target.value)}
                type="number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ventilationType">Type de ventilation</Label>
              <Select 
                value={ventilationType}
                onValueChange={(value: VentilationType) => setVentilationType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner ventilation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caso1">Légèrement ventilé (Caso 1)</SelectItem>
                  <SelectItem value="caso2">Très ventilé (Caso 2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ratio">Ratio Ah-nh / Anh-e</Label>
              <Input
                id="ratio"
                value={ratioValue.toString()}
                onChange={(e) => setRatioValue(parseFloat(e.target.value) || 0)}
                type="number"
                step="0.01"
              />
              <p className="text-xs text-gray-500">
                Rapport entre surface isolée et surface totale de l'enveloppe thermique
              </p>
            </div>
            
            <div className="pt-4 space-y-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Coefficient B avant:</span>
                <span className="font-medium">{bCoefficientBefore.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Coefficient B après:</span>
                <span className="font-medium">{bCoefficientAfter.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Amélioration U-value:</span>
                <span className="font-medium">{improvementPercent.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Résultat:</span>
                <Badge variant={meetsRequirements ? "success" : "destructive"}>
                  {meetsRequirements ? "Conforme" : "Non conforme"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium">Catégorie:</span>
                <Badge>{projectType}</Badge>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </CardContent>
        </Card>

        {/* Sélecteur de matériaux */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Matériaux</CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialSelector onSelectMaterial={(material) => addLayer("after", material)} />
          </CardContent>
        </Card>

        {/* Calculs thermiques */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Module de Calcul</CardTitle>
            <CardDescription>
              Saisissez les matériaux et épaisseurs pour calculer la résistance thermique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bloc "Avant les travaux" */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Avant les travaux</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={() => addLayer("before", predefinedMaterials[0])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Ajouter couche
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matériau</TableHead>
                      <TableHead className="w-[120px]">Épaisseur (mm)</TableHead>
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
                        onUpdate={(updatedLayer) => updateLayer("before", updatedLayer)}
                        isNew={layer.isNew}
                      />
                    ))}
                  </TableBody>
                </Table>
                
                <div className="p-3 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Résistance thermique totale (avec Rsi + Rse):</span>
                      <span className="ml-2 font-medium">{totalRBefore.toFixed(2)} m²K/W</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Transmittance U:</span>
                      <span className="ml-2 font-medium">{uValueBefore.toFixed(2)} W/m²K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bloc "Après les travaux" */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                <div className="flex items-center">
                  <h3 className="font-medium">Après les travaux</h3>
                  <ArrowRight className="h-4 w-4 mx-2 text-green-600" />
                  <Badge variant="success" className="ml-1">Amélioration: {improvementPercent.toFixed(1)}%</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={() => addLayer("after", predefinedMaterials[0])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Ajouter couche
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matériau</TableHead>
                      <TableHead className="w-[120px]">Épaisseur (mm)</TableHead>
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
                        onUpdate={(updatedLayer) => updateLayer("after", updatedLayer)}
                        isNew={layer.isNew}
                      />
                    ))}
                  </TableBody>
                </Table>
                
                <div className="p-3 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Résistance thermique totale (avec Rsi + Rse):</span>
                      <span className="ml-2 font-medium">{totalRAfter.toFixed(2)} m²K/W</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Transmittance U:</span>
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
