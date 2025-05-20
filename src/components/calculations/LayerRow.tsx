
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Material, predefinedMaterials } from "@/data/materials";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Layer extends Material {
  isNew?: boolean;
}

interface LayerRowProps {
  layer: Layer;
  onDelete: () => void;
  onUpdate?: (updatedLayer: Layer) => void;
  isNew?: boolean;
}

const LayerRow = ({ layer, onDelete, onUpdate, isNew = false }: LayerRowProps) => {
  const [name, setName] = useState(layer.name);
  const [thickness, setThickness] = useState(layer.thickness.toString());
  const [lambda, setLambda] = useState(layer.lambda.toString());
  
  // Calcul R = e / λ (e en mètres, division par 1000)
  const calculateR = () => {
    if (lambda === "-") return layer.r;
    const lambdaValue = parseFloat(lambda);
    const thicknessValue = parseFloat(thickness);
    if (isNaN(lambdaValue) || isNaN(thicknessValue) || lambdaValue === 0) return 0;
    return thicknessValue / 1000 / lambdaValue;
  };
  
  const rValue = calculateR();
  const thicknessInMeters = parseFloat(thickness) / 1000;

  // Mise à jour du matériau sélectionné
  const handleMaterialSelect = (materialId: string) => {
    const selectedMaterial = predefinedMaterials.find(m => m.id === materialId);
    if (selectedMaterial) {
      setName(selectedMaterial.name);
      setThickness(selectedMaterial.thickness.toString());
      setLambda(selectedMaterial.lambda.toString());
      
      if (onUpdate) {
        onUpdate({
          ...layer,
          name: selectedMaterial.name,
          thickness: selectedMaterial.thickness,
          lambda: selectedMaterial.lambda,
          r: selectedMaterial.r
        });
      }
    }
  };

  const handleUpdate = (field: string, value: string) => {
    let updatedLayer: Layer;
    
    if (field === "name") {
      setName(value);
      updatedLayer = { ...layer, name: value };
    } else if (field === "thickness") {
      setThickness(value);
      const thicknessValue = parseFloat(value);
      const r = !isNaN(thicknessValue) && lambda !== "-" ? thicknessValue / 1000 / parseFloat(lambda.toString()) : layer.r;
      updatedLayer = { ...layer, thickness: thicknessValue, r };
    } else if (field === "lambda") {
      setLambda(value);
      const lambdaValue = value === "-" ? "-" : parseFloat(value);
      const r = value !== "-" && !isNaN(parseFloat(value)) ? parseFloat(thickness) / 1000 / parseFloat(value) : layer.r;
      updatedLayer = { ...layer, lambda: lambdaValue, r };
    } else {
      return;
    }
    
    if (onUpdate) {
      onUpdate(updatedLayer);
    }
  };
  
  return (
    <TableRow className={cn(isNew && "bg-green-50")}>
      <TableCell>
        <Select onValueChange={handleMaterialSelect} defaultValue="">
          <SelectTrigger className="h-8">
            <SelectValue placeholder={name} />
          </SelectTrigger>
          <SelectContent>
            {predefinedMaterials.map((material) => (
              <SelectItem key={material.id} value={material.id}>{material.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={thickness}
            onChange={(e) => handleUpdate("thickness", e.target.value)}
            className="h-8"
          />
          <span className="text-xs text-gray-500">({thicknessInMeters.toFixed(3)} m)</span>
        </div>
      </TableCell>
      <TableCell>
        <Input
          value={lambda}
          onChange={(e) => handleUpdate("lambda", e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          value={rValue.toFixed(3)}
          readOnly
          className="h-8 bg-gray-50"
        />
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default LayerRow;
