
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MaterialSelector from "./MaterialSelector";
import { predefinedMaterials, Material } from "@/data/materials";
import { calculateBCoefficient, calculateThermalResistance, calculateUValue, VentilationType } from "@/utils/calculationUtils";
import ProjectInfo from "./ProjectInfo";
import LayerSection from "./LayerSection";

interface ProjectCalculationProps {
  clientId?: string;
}

interface Layer extends Material {
  isNew?: boolean;
}

const initialLayers: Layer[] = [
  { id: "1", name: "Enduit de plâtre", thickness: 15, lambda: 0.3, r: 0.05 },
  { id: "2", name: "Brique céramique", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "3", name: "Lame d'air", thickness: 50, lambda: "-", r: 0.18 },
  { id: "4", name: "Brique céramique", thickness: 115, lambda: 0.85, r: 0.14 },
  { id: "5", name: "Enduit de plâtre", thickness: 15, lambda: 0.3, r: 0.05 }
];

const ProjectCalculation = ({ clientId }: ProjectCalculationProps) => {
  const [beforeLayers, setBeforeLayers] = useState<Layer[]>(initialLayers);
  const [afterLayers, setAfterLayers] = useState<Layer[]>([
    ...initialLayers,
    { id: "6", name: "Isolant EPS", thickness: 80, lambda: 0.031, r: 2.58, isNew: true }
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
        {/* Project Information */}
        <ProjectInfo 
          projectType={projectType}
          setProjectType={setProjectType}
          surfaceArea={surfaceArea}
          setSurfaceArea={setSurfaceArea}
          ventilationType={ventilationType}
          setVentilationType={setVentilationType}
          ratioValue={ratioValue}
          setRatioValue={setRatioValue}
          bCoefficientBefore={bCoefficientBefore}
          bCoefficientAfter={bCoefficientAfter}
          improvementPercent={improvementPercent}
          meetsRequirements={meetsRequirements}
        />

        {/* Material Selector */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Matériaux</CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialSelector onSelectMaterial={(material) => addLayer("after", material)} />
          </CardContent>
        </Card>

        {/* Thermal Calculations */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Module de Calcul</CardTitle>
            <CardDescription>
              Saisissez les matériaux et épaisseurs pour calculer la résistance thermique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Before Work Section */}
            <LayerSection
              title="Avant les travaux"
              layers={beforeLayers}
              totalR={totalRBefore}
              uValue={uValueBefore}
              onAddLayer={(material) => addLayer("before", material)}
              onUpdateLayer={(updatedLayer) => updateLayer("before", updatedLayer)}
              onDeleteLayer={(id) => setBeforeLayers(beforeLayers.filter(l => l.id !== id))}
            />
            
            {/* After Work Section */}
            <LayerSection
              title="Après les travaux"
              layers={afterLayers}
              totalR={totalRAfter}
              uValue={uValueAfter}
              onAddLayer={(material) => addLayer("after", material)}
              onUpdateLayer={(updatedLayer) => updateLayer("after", updatedLayer)}
              onDeleteLayer={(id) => setAfterLayers(afterLayers.filter(l => l.id !== id))}
              showImprovement={true}
              improvementPercent={improvementPercent}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectCalculation;
