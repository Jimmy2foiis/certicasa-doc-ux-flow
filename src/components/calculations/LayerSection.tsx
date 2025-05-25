
import { useState } from "react";
import { Material } from "@/data/materials";
import { Layer } from "@/hooks/useLayerManagement";
import { VentilationType } from "@/utils/calculationUtils";
import LayerSectionHeader from "./layer-section/LayerSectionHeader";
import RsiRseInputs from "./layer-section/RsiRseInputs";
import VentilationRatioControls from "./layer-section/VentilationRatioControls";
import BCoefficientTable from "./layer-section/BCoefficientTable";
import LayerTable from "./layer-section/LayerTable";
import CalculationSummary from "./layer-section/CalculationSummary";

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
  bCoefficient: number;
  isAfterWork?: boolean;
  rsi: string;
  setRsi: (value: string) => void;
  rse: string;
  setRse: (value: string) => void;
  ventilationType: VentilationType;
  setVentilationType: (value: VentilationType) => void;
  ratioValue: number;
  setRatioValue: (value: number) => void;
  onAddSouflr47?: () => void;
  lockVentilationType?: boolean;
  onCopyBeforeToAfter?: () => void;
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
  improvementPercent = 0,
  bCoefficient,
  isAfterWork = false,
  rsi,
  setRsi,
  rse,
  setRse,
  ventilationType,
  setVentilationType,
  ratioValue,
  setRatioValue,
  onAddSouflr47,
  lockVentilationType = false,
  onCopyBeforeToAfter
}: LayerSectionProps) => {
  const [showBCoefficientTable, setShowBCoefficientTable] = useState(false);

  const handleAddLayer = () => {
    onAddLayer({ id: Date.now().toString(), name: "Sélectionnez un matériau", thickness: 10, lambda: 0.5, r: 0.02 });
  };

  return (
    <div className="space-y-4">
      <LayerSectionHeader
        title={title}
        bCoefficient={bCoefficient}
        showImprovement={showImprovement}
        improvementPercent={improvementPercent}
        isAfterWork={isAfterWork}
        onShowBCoefficientTable={() => setShowBCoefficientTable(!showBCoefficientTable)}
        onCopyBeforeToAfter={onCopyBeforeToAfter}
        onAddSouflr47={onAddSouflr47}
        onAddLayer={handleAddLayer}
      />
      
      <RsiRseInputs
        rsi={rsi}
        setRsi={setRsi}
        rse={rse}
        setRse={setRse}
        isAfterWork={isAfterWork}
      />
      
      <VentilationRatioControls
        ventilationType={ventilationType}
        setVentilationType={setVentilationType}
        ratioValue={ratioValue}
        setRatioValue={setRatioValue}
        isAfterWork={isAfterWork}
      />
      
      {showBCoefficientTable && (
        <BCoefficientTable
          isAfterWork={isAfterWork}
          ventilationType={ventilationType}
          ratioValue={ratioValue}
        />
      )}
      
      <LayerTable
        layers={layers}
        onDelete={onDeleteLayer}
        onUpdate={onUpdateLayer}
      />
      
      <CalculationSummary
        totalR={totalR}
        bCoefficient={bCoefficient}
        uValue={uValue}
        isAfterWork={isAfterWork}
      />
    </div>
  );
};

export default LayerSection;
