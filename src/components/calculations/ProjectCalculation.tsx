
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { predefinedMaterials, Material } from "@/data/materials";
import { calculateBCoefficient, calculateThermalResistance, calculateUpValue, calculateUfValue, VentilationType, calculateRatioFromAreas } from "@/utils/calculationUtils";
import ProjectInfo from "./ProjectInfo";
import LayerSection from "./LayerSection";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ProjectCalculationProps {
  clientId?: string;
  projectId?: string | null;
  savedData?: any;
  onSave?: (calculationData: any) => void;
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

// Définition du matériau SOUFL'R 47
const souflr47Material: Layer = {
  id: "souflr47",
  name: "SOUFL'R 47",
  thickness: 259, // 259 mm = 0.259 m
  lambda: 0.047,
  r: 5.51, // 0.259 / 0.047 ≈ 5.51
  isNew: true
};

const ProjectCalculation = ({ clientId, projectId, savedData, onSave }: ProjectCalculationProps) => {
  const [beforeLayers, setBeforeLayers] = useState<Layer[]>(initialLayers);
  const [afterLayers, setAfterLayers] = useState<Layer[]>([...initialLayers]);
  
  const [projectType, setProjectType] = useState("RES010");
  const [surfaceArea, setSurfaceArea] = useState("127");
  const [roofArea, setRoofArea] = useState("150");
  
  const [ventilationBefore, setVentilationBefore] = useState<VentilationType>("caso1");
  const [ventilationAfter, setVentilationAfter] = useState<VentilationType>("caso1");
  
  const [ratioBefore, setRatioBefore] = useState(0.85);
  const [ratioAfter, setRatioAfter] = useState(0.85);
  
  const [rsiBefore, setRsiBefore] = useState("0.10");
  const [rseBefore, setRseBefore] = useState("0.10");
  
  const [rsiAfter, setRsiAfter] = useState("0.10");
  const [rseAfter, setRseAfter] = useState("0.10");
  
  // Charger les données sauvegardées si disponibles
  useEffect(() => {
    if (savedData) {
      // Restaurer toutes les valeurs à partir des données sauvegardées
      if (savedData.beforeLayers) setBeforeLayers(savedData.beforeLayers);
      if (savedData.afterLayers) setAfterLayers(savedData.afterLayers);
      if (savedData.projectType) setProjectType(savedData.projectType);
      if (savedData.surfaceArea) setSurfaceArea(savedData.surfaceArea);
      if (savedData.roofArea) setRoofArea(savedData.roofArea);
      if (savedData.ventilationBefore) setVentilationBefore(savedData.ventilationBefore);
      if (savedData.ventilationAfter) setVentilationAfter(savedData.ventilationAfter);
      if (savedData.ratioBefore) setRatioBefore(savedData.ratioBefore);
      if (savedData.ratioAfter) setRatioAfter(savedData.ratioAfter);
      if (savedData.rsiBefore) setRsiBefore(savedData.rsiBefore);
      if (savedData.rseBefore) setRseBefore(savedData.rseBefore);
      if (savedData.rsiAfter) setRsiAfter(savedData.rsiAfter);
      if (savedData.rseAfter) setRseAfter(savedData.rseAfter);
    } else {
      // Synchronisation des couches "avant travaux" vers "après travaux" - uniquement au chargement initial
      setAfterLayers([...beforeLayers]);
    }
  }, [savedData]);
  
  // Calculate ratios automatically when surface areas change
  useEffect(() => {
    const comblesArea = parseFloat(surfaceArea);
    const toitureArea = parseFloat(roofArea);
    
    if (!isNaN(comblesArea) && !isNaN(toitureArea) && toitureArea > 0) {
      const calculatedRatio = calculateRatioFromAreas(comblesArea, toitureArea);
      setRatioBefore(calculatedRatio);
      setRatioAfter(calculatedRatio);
    }
  }, [surfaceArea, roofArea]);
  
  // Calcul du coefficient B avant
  const bCoefficientBefore = calculateBCoefficient({
    ratio: ratioBefore,
    ventilationType: ventilationBefore,
    isAfterWork: false
  });
  
  // Calcul du coefficient B après
  const bCoefficientAfter = calculateBCoefficient({
    ratio: ratioAfter,
    ventilationType: ventilationAfter,
    isAfterWork: true
  });

  const rsiRseBeforeValue = parseFloat(rsiBefore) + parseFloat(rseBefore);
  const rsiRseBeforeFallback = isNaN(rsiRseBeforeValue) ? 0.17 : rsiRseBeforeValue;
  
  const rsiRseAfterValue = parseFloat(rsiAfter) + parseFloat(rseAfter);
  const rsiRseAfterFallback = isNaN(rsiRseAfterValue) ? 0.17 : rsiRseAfterValue;

  // Calcul de la résistance thermique totale avant
  const totalRBefore = calculateThermalResistance(beforeLayers, rsiRseBeforeFallback);
  const upValueBefore = calculateUpValue(totalRBefore);
  const uValueBefore = calculateUfValue(upValueBefore, bCoefficientBefore);
  
  // Calcul de la résistance thermique totale après
  const totalRAfter = calculateThermalResistance(afterLayers, rsiRseAfterFallback);
  const upValueAfter = calculateUpValue(totalRAfter);
  const uValueAfter = calculateUfValue(upValueAfter, bCoefficientAfter);
  
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
  
  // Fonction spécifique pour ajouter le matériau SOUFL'R 47
  const addSouflr47 = () => {
    const newSouflr = {
      ...souflr47Material,
      id: Date.now().toString()
    };
    setAfterLayers([...afterLayers, newSouflr]);
  };
  
  // Fonction pour copier les valeurs de "Avant Travaux" vers "Après Travaux"
  const copyBeforeToAfter = () => {
    setAfterLayers([...beforeLayers]);
    setRatioAfter(ratioBefore);
    setRsiAfter(rsiBefore);
    setRseAfter(rseBefore);
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

  // Fonction pour enregistrer les données
  const handleSave = () => {
    if (onSave) {
      const calculationData = {
        projectType,
        surfaceArea,
        roofArea,
        ventilationBefore,
        ventilationAfter,
        ratioBefore,
        ratioAfter,
        rsiBefore,
        rseBefore,
        rsiAfter,
        rseAfter,
        beforeLayers,
        afterLayers,
        totalRBefore,
        upValueBefore,
        uValueBefore,
        totalRAfter,
        upValueAfter,
        uValueAfter,
        improvementPercent,
        meetsRequirements
      };
      
      onSave(calculationData);
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
          roofArea={roofArea}
          setRoofArea={setRoofArea}
          improvementPercent={improvementPercent}
          meetsRequirements={meetsRequirements}
        />

        {/* Thermal Calculations */}
        <Card className="lg:col-span-9">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Module de Calcul</CardTitle>
              <CardDescription>
                Saisissez les matériaux et épaisseurs pour calculer la résistance thermique
              </CardDescription>
            </div>
            {onSave && (
              <Button 
                onClick={handleSave} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Before Work Section */}
            <LayerSection
              title="Avant les travaux"
              layers={beforeLayers}
              totalR={totalRBefore}
              uValue={uValueBefore}
              bCoefficient={bCoefficientBefore}
              onAddLayer={(material) => addLayer("before", material)}
              onUpdateLayer={(updatedLayer) => updateLayer("before", updatedLayer)}
              onDeleteLayer={(id) => setBeforeLayers(beforeLayers.filter(l => l.id !== id))}
              rsi={rsiBefore}
              setRsi={setRsiBefore}
              rse={rseBefore}
              setRse={setRseBefore}
              ventilationType={ventilationBefore}
              setVentilationType={setVentilationBefore}
              ratioValue={ratioBefore}
              setRatioValue={setRatioBefore}
            />
            
            {/* After Work Section */}
            <LayerSection
              title="Après les travaux"
              layers={afterLayers}
              totalR={totalRAfter}
              uValue={uValueAfter}
              bCoefficient={bCoefficientAfter}
              onAddLayer={(material) => addLayer("after", material)}
              onUpdateLayer={(updatedLayer) => updateLayer("after", updatedLayer)}
              onDeleteLayer={(id) => setAfterLayers(afterLayers.filter(l => l.id !== id))}
              showImprovement={true}
              improvementPercent={improvementPercent}
              isAfterWork={true}
              rsi={rsiAfter}
              setRsi={setRsiAfter}
              rse={rseAfter}
              setRse={setRseAfter}
              ventilationType={ventilationAfter}
              setVentilationType={setVentilationAfter}
              ratioValue={ratioAfter}
              setRatioValue={setRatioAfter}
              onAddSouflr47={addSouflr47}
              onCopyBeforeToAfter={copyBeforeToAfter}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectCalculation;
