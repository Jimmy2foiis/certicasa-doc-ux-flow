
import { Card, CardContent } from "@/components/ui/card";
import LayerSection from "./LayerSection";
import ThermalEconomySection from "./ThermalEconomySection";
import { CalculationData } from "@/hooks/useCalculationState";

interface CalculationContentProps {
  calculationData: CalculationData;
  onAddLayer: (layerSet: "before" | "after", material: any) => void;
  onUpdateLayer: (layerSet: "before" | "after", updatedLayer: any) => void;
  onDeleteBeforeLayer: (id: string) => void;
  onDeleteAfterLayer: (id: string) => void;
  onAddSouflr47: () => void;
  onCopyBeforeToAfter: () => void;
  setRsiBefore: (value: string) => void;
  setRseBefore: (value: string) => void;
  setRsiAfter: (value: string) => void;
  setRseAfter: (value: string) => void;
  setVentilationBefore: (value: any) => void;
  setVentilationAfter: (value: any) => void;
  setRatioBefore: (value: number) => void;
  setRatioAfter: (value: number) => void;
}

const CalculationContent = ({
  calculationData,
  onAddLayer,
  onUpdateLayer,
  onDeleteBeforeLayer,
  onDeleteAfterLayer,
  onAddSouflr47,
  onCopyBeforeToAfter,
  setRsiBefore,
  setRseBefore,
  setRsiAfter,
  setRseAfter,
  setVentilationBefore,
  setVentilationAfter,
  setRatioBefore,
  setRatioAfter
}: CalculationContentProps) => {
  const {
    beforeLayers,
    afterLayers,
    totalRBefore,
    totalRAfter,
    uValueBefore,
    uValueAfter,
    improvementPercent,
    bCoefficientBefore,
    bCoefficientAfter,
    rsiBefore,
    rseBefore,
    rsiAfter,
    rseAfter,
    ventilationBefore,
    ventilationAfter,
    ratioBefore,
    ratioAfter,
    surfaceArea,
    climateZone,
    projectType
  } = calculationData;

  return (
    <CardContent className="space-y-6">
      {/* Before Work Section */}
      <LayerSection
        title="Avant les travaux"
        layers={beforeLayers}
        totalR={totalRBefore}
        uValue={uValueBefore}
        bCoefficient={bCoefficientBefore}
        onAddLayer={(material) => onAddLayer("before", material)}
        onUpdateLayer={(updatedLayer) => onUpdateLayer("before", updatedLayer)}
        onDeleteLayer={onDeleteBeforeLayer}
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
        onAddLayer={(material) => onAddLayer("after", material)}
        onUpdateLayer={(updatedLayer) => onUpdateLayer("after", updatedLayer)}
        onDeleteLayer={onDeleteAfterLayer}
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
        onAddSouflr47={onAddSouflr47}
        onCopyBeforeToAfter={onCopyBeforeToAfter}
      />
      
      {/* Thermal Economy Section */}
      <ThermalEconomySection 
        surfaceArea={parseFloat(surfaceArea) || 0}
        uValueBefore={uValueBefore}
        uValueAfter={uValueAfter}
        climateZone={climateZone}
        projectType={projectType}
      />
    </CardContent>
  );
};

export default CalculationContent;
