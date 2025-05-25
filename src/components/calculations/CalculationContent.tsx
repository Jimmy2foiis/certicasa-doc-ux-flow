import { Card, CardContent } from "@/components/ui/card";
import LayerSection from "./LayerSection";
import ThermalEconomySection from "./thermal-economy/ThermalEconomySection";
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
  // Adapter functions for before layers
  const handleAddLayerBefore = (material: Material) => {
    onAddLayer("before");
  };

  const handleUpdateLayerBefore = (updatedLayer: Layer) => {
    onUpdateLayer(updatedLayer.id, "layer", updatedLayer);
  };

  const handleAddSouflr47Before = () => {
    onAddSouflr47("before");
  };

  // Adapter functions for after layers
  const handleAddLayerAfter = (material: Material) => {
    onAddLayer("after");
  };

  const handleUpdateLayerAfter = (updatedLayer: Layer) => {
    onUpdateLayer(updatedLayer.id, "layer", updatedLayer);
  };

  const handleAddSouflr47After = () => {
    onAddSouflr47("after");
  };

  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        {/* Section Avant Travaux */}
        <LayerSection
          title="Avant Travaux"
          layers={calculationData.beforeLayers}
          totalR={calculationData.totalRBefore}
          uValue={calculationData.uValueBefore}
          onAddLayer={handleAddLayerBefore}
          onUpdateLayer={handleUpdateLayerBefore}
          onDeleteLayer={onDeleteBeforeLayer}
          bCoefficient={calculationData.bCoefficientBefore}
          rsi={calculationData.rsiBefore}
          setRsi={setRsiBefore}
          rse={calculationData.rseBefore}
          setRse={setRseBefore}
          ventilationType={calculationData.ventilationBefore}
          setVentilationType={setVentilationBefore}
          ratioValue={calculationData.ratioBefore}
          setRatioValue={setRatioBefore}
        />

        {/* Section Après Travaux */}
        <LayerSection
          title="Après Travaux"
          layers={calculationData.afterLayers}
          totalR={calculationData.totalRAfter}
          uValue={calculationData.uValueAfter}
          onAddLayer={handleAddLayerAfter}
          onUpdateLayer={handleUpdateLayerAfter}
          onDeleteLayer={onDeleteAfterLayer}
          showImprovement={true}
          improvementPercent={calculationData.improvementPercent}
          bCoefficient={calculationData.bCoefficientAfter}
          isAfterWork={true}
          rsi={calculationData.rsiAfter}
          setRsi={setRsiAfter}
          rse={calculationData.rseAfter}
          setRse={setRseAfter}
          ventilationType={calculationData.ventilationAfter}
          setVentilationType={setVentilationAfter}
          ratioValue={calculationData.ratioAfter}
          setRatioValue={setRatioAfter}
          onAddSouflr47={handleAddSouflr47After}
          onCopyBeforeToAfter={onCopyBeforeToAfter}
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
