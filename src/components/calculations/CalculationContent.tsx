
import { Card, CardContent } from "@/components/ui/card";
import LayerSection from "./LayerSection";
import ThermalEconomySection from "./ThermalEconomySection";
import { CalculationData } from "@/hooks/useCalculationState";
import { Material } from "@/data/materials";
import { Layer } from "@/hooks/useLayerManagement";

interface CalculationContentProps {
  calculationData: CalculationData;
  onAddLayer: (type: "before" | "after") => void;
  onUpdateLayer: (id: string, field: string, value: any) => void;
  onDeleteBeforeLayer: (id: string) => void;
  onDeleteAfterLayer: (id: string) => void;
  onAddSouflr47: (type: "before" | "after") => void;
  onCopyBeforeToAfter: () => void;
  setRsiBefore: (value: string) => void;
  setRseBefore: (value: string) => void;
  setRsiAfter: (value: string) => void;
  setRseAfter: (value: string) => void;
  setVentilationBefore: (value: any) => void;
  setVentilationAfter: (value: any) => void;
  setRatioBefore: (value: number) => void;
  setRatioAfter: (value: number) => void;
  onClimateZoneChange?: (zone: string) => void;
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
  setRatioAfter,
  onClimateZoneChange
}: CalculationContentProps) => {
  // Adapter functions to match LayerSection expectations
  const handleAddLayerBefore = (material: Material) => {
    onAddLayer("before");
  };

  const handleAddLayerAfter = (material: Material) => {
    onAddLayer("after");
  };

  const handleUpdateLayerBefore = (updatedLayer: Layer) => {
    onUpdateLayer(updatedLayer.id, "layer", updatedLayer);
  };

  const handleUpdateLayerAfter = (updatedLayer: Layer) => {
    onUpdateLayer(updatedLayer.id, "layer", updatedLayer);
  };

  const handleAddSouflr47Before = () => {
    onAddSouflr47("before");
  };

  const handleAddSouflr47After = () => {
    onAddSouflr47("after");
  };

  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        <LayerSection
          beforeLayers={calculationData.beforeLayers}
          afterLayers={calculationData.afterLayers}
          onAddLayerBefore={handleAddLayerBefore}
          onAddLayerAfter={handleAddLayerAfter}
          onUpdateLayerBefore={handleUpdateLayerBefore}
          onUpdateLayerAfter={handleUpdateLayerAfter}
          onDeleteBeforeLayer={onDeleteBeforeLayer}
          onDeleteAfterLayer={onDeleteAfterLayer}
          onAddSouflr47Before={handleAddSouflr47Before}
          onAddSouflr47After={handleAddSouflr47After}
          onCopyBeforeToAfter={onCopyBeforeToAfter}
          ventilationBefore={calculationData.ventilationBefore}
          ventilationAfter={calculationData.ventilationAfter}
          setVentilationBefore={setVentilationBefore}
          setVentilationAfter={setVentilationAfter}
          ratioBefore={calculationData.ratioBefore}
          ratioAfter={calculationData.ratioAfter}
          setRatioBefore={setRatioBefore}
          setRatioAfter={setRatioAfter}
          rsiBefore={calculationData.rsiBefore}
          rseBefore={calculationData.rseBefore}
          rsiAfter={calculationData.rsiAfter}
          rseAfter={calculationData.rseAfter}
          setRsiBefore={setRsiBefore}
          setRseBefore={setRseBefore}
          setRsiAfter={setRsiAfter}
          setRseAfter={setRseAfter}
          totalRBefore={calculationData.totalRBefore}
          totalRAfter={calculationData.totalRAfter}
          upValueBefore={calculationData.upValueBefore}
          upValueAfter={calculationData.upValueAfter}
          uValueBefore={calculationData.uValueBefore}
          uValueAfter={calculationData.uValueAfter}
          improvementPercent={calculationData.improvementPercent}
          meetsRequirements={calculationData.meetsRequirements}
          bCoefficientBefore={calculationData.bCoefficientBefore}
          bCoefficientAfter={calculationData.bCoefficientAfter}
        />

        <ThermalEconomySection
          surfaceArea={parseFloat(calculationData.surfaceArea)}
          uValueBefore={calculationData.uValueBefore}
          uValueAfter={calculationData.uValueAfter}
          climateZone={calculationData.climateZone}
          projectType={calculationData.projectType}
          onClimateZoneChange={onClimateZoneChange}
        />
      </div>
    </CardContent>
  );
};

export default CalculationContent;
