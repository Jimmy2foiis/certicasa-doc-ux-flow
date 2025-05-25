
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
  // Stocke l'épaisseur en millimètres en interne
  const [thickness, setThickness] = useState(layer.thickness.toString());
  // Stocke l'épaisseur en mètres pour l'affichage et l'édition
  const [thicknessInMeters, setThicknessInMeters] = useState((layer.thickness / 1000).toString());
  const [lambda, setLambda] = useState(layer.lambda.toString());
  
  // Calcul R = e / λ (e en mètres)
  const calculateR = () => {
    if (lambda === "-") return layer.r;
    const lambdaValue = parseFloat(lambda);
    const thicknessValue = parseFloat(thickness);
    if (isNaN(lambdaValue) || isNaN(thicknessValue) || lambdaValue === 0) return 0;
    return thicknessValue / 1000 / lambdaValue;
  };
  
  const rValue = calculateR();

  // Synchronisation des valeurs d'épaisseur (mm <-> m)
  useEffect(() => {
    // Mise à jour de l'épaisseur en mètres quand l'épaisseur en mm change
    setThicknessInMeters((parseFloat(thickness) / 1000).toFixed(3));
  }, [thickness]);

  // Met à jour automatiquement le layer parent quand les valeurs changent
  useEffect(() => {
    if (onUpdate) {
      const updatedLayer = { 
        ...layer, 
        name,
        thickness: parseFloat(thickness) || layer.thickness,
        lambda: lambda === "-" ? "-" : parseFloat(lambda) || layer.lambda,
        r: rValue
      };
      onUpdate(updatedLayer);
    }
  }, [name, thickness, lambda, rValue, onUpdate, layer]);

  // Met à jour l'épaisseur en mm quand l'utilisateur modifie l'épaisseur en mètres
  const handleThicknessInMetersChange = (value: string) => {
    setThicknessInMeters(value);
    // Convertir en mm pour le stockage interne
    const thicknessInMm = Math.round(parseFloat(value) * 1000);
    if (!isNaN(thicknessInMm)) {
      setThickness(thicknessInMm.toString());
    }
  };

  // Mise à jour du matériau sélectionné
  const handleMaterialSelect = (materialId: string) => {
    const selectedMaterial = predefinedMaterials.find(m => m.id === materialId);
    if (selectedMaterial) {
      setName(selectedMaterial.name);
      setThickness(selectedMaterial.thickness.toString());
      setThicknessInMeters((selectedMaterial.thickness / 1000).toFixed(3));
      setLambda(selectedMaterial.lambda.toString());
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleLambdaChange = (value: string) => {
    setLambda(value);
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
            value={thicknessInMeters}
            onChange={(e) => handleThicknessInMetersChange(e.target.value)}
            className="h-8"
            step="0.001"
            min="0.001"
          />
          <span className="text-xs text-gray-500">m</span>
        </div>
      </TableCell>
      <TableCell>
        <Input
          value={lambda}
          onChange={(e) => handleLambdaChange(e.target.value)}
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
