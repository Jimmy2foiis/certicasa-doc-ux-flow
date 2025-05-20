
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Layer {
  id: string;
  material: string;
  thickness: number;
  lambda: number | string;
  r: number;
}

interface LayerRowProps {
  layer: Layer;
  onDelete: () => void;
  isNew?: boolean;
}

const LayerRow = ({ layer, onDelete, isNew = false }: LayerRowProps) => {
  const [material, setMaterial] = useState(layer.material);
  const [thickness, setThickness] = useState(layer.thickness.toString());
  const [lambda, setLambda] = useState(layer.lambda.toString());
  
  // Calcular R = e / λ (e en metros, por eso dividimos por 1000)
  const calculateR = () => {
    if (lambda === "-") return layer.r;
    const lambdaValue = parseFloat(lambda);
    const thicknessValue = parseFloat(thickness);
    if (isNaN(lambdaValue) || isNaN(thicknessValue) || lambdaValue === 0) return 0;
    return thicknessValue / 1000 / lambdaValue;
  };
  
  const rValue = calculateR();
  
  return (
    <TableRow className={cn(isNew && "bg-green-50")}>
      <TableCell>
        <Input
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={thickness}
          onChange={(e) => setThickness(e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          value={lambda}
          onChange={(e) => setLambda(e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          value={rValue.toFixed(2)}
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
