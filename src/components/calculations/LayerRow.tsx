
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Material, predefinedMaterials } from "@/data/materials";
import MaterialSelect from "./layer-section/MaterialSelect";
import ThicknessInput from "./layer-section/ThicknessInput";
import LambdaInput from "./layer-section/LambdaInput";
import ResistanceDisplay from "./layer-section/ResistanceDisplay";
import DeleteButton from "./layer-section/DeleteButton";

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
      
      console.log('📊 LayerRow - Mise à jour couche:', {
        id: updatedLayer.id,
        name: updatedLayer.name,
        thicknessOriginal: layer.thickness,
        thicknessModified: updatedLayer.thickness,
        lambda: updatedLayer.lambda,
        r: updatedLayer.r
      });
      
      onUpdate(updatedLayer);
    }
  }, [name, thickness, lambda, rValue, onUpdate, layer]);

  // Met à jour l'épaisseur en mm quand l'utilisateur modifie l'épaisseur en mètres
  const handleThicknessInMetersChange = (value: string) => {
    console.log('🔄 LayerRow - Changement épaisseur:', {
      layerId: layer.id,
      layerName: layer.name,
      oldValue: thicknessInMeters,
      newValue: value
    });
    
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
        <MaterialSelect 
          currentName={name}
          onMaterialSelect={handleMaterialSelect}
        />
      </TableCell>
      <TableCell>
        <ThicknessInput
          value={thicknessInMeters}
          onChange={handleThicknessInMetersChange}
        />
      </TableCell>
      <TableCell>
        <LambdaInput
          value={lambda}
          onChange={handleLambdaChange}
        />
      </TableCell>
      <TableCell>
        <ResistanceDisplay value={rValue} />
      </TableCell>
      <TableCell>
        <DeleteButton onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

export default LayerRow;
