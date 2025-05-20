
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LayerRow from "./LayerRow";
import { Material } from "@/data/materials";

interface Layer extends Material {
  isNew?: boolean;
}

interface LayerSectionProps {
  title: string;
  layers: Layer[];
  totalR: number;
  uValue: number;
  onAddLayer: (material: Material) => void;
  onUpdateLayer: (updatedLayer: Layer) => void;
  onDeleteLayer: (id: string) => void;
  showImprovement?: boolean;
  improvementPercent?: number;
}

const LayerSection = ({
  title,
  layers,
  totalR,
  uValue,
  onAddLayer,
  onUpdateLayer,
  onDeleteLayer,
  showImprovement = false,
  improvementPercent = 0
}: LayerSectionProps) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          {showImprovement && (
            <>
              <ArrowRight className="h-4 w-4 mx-2 text-green-600" />
              <Badge variant="success" className="ml-1">Amélioration: {improvementPercent.toFixed(1)}%</Badge>
            </>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => onAddLayer({ id: "default", name: "Sélectionnez un matériau", thickness: 10, lambda: 0.5, r: 0.02 })}
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
            {layers.map((layer) => (
              <LayerRow 
                key={layer.id} 
                layer={layer}
                onDelete={() => onDeleteLayer(layer.id)}
                onUpdate={(updatedLayer) => onUpdateLayer(updatedLayer)}
                isNew={layer.isNew}
              />
            ))}
          </TableBody>
        </Table>
        
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Résistance thermique totale (avec Rsi + Rse):</span>
              <span className="ml-2 font-medium">{totalR.toFixed(2)} m²K/W</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Transmittance U:</span>
              <span className="ml-2 font-medium">{uValue.toFixed(2)} W/m²K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSection;
