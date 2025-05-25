
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Table as TableIcon, Copy } from "lucide-react";

interface LayerSectionHeaderProps {
  title: string;
  bCoefficient: number;
  showImprovement?: boolean;
  improvementPercent?: number;
  isAfterWork?: boolean;
  onShowBCoefficientTable: () => void;
  onCopyBeforeToAfter?: () => void;
  onAddSouflr47?: () => void;
  onAddLayer: () => void;
}

const LayerSectionHeader = ({
  title,
  bCoefficient,
  showImprovement = false,
  improvementPercent = 0,
  isAfterWork = false,
  onShowBCoefficientTable,
  onCopyBeforeToAfter,
  onAddSouflr47,
  onAddLayer
}: LayerSectionHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
      <div className="flex items-center flex-wrap">
        <h3 className="font-medium">{title}</h3>
        <Badge 
          variant="outline" 
          className="ml-2 cursor-pointer flex items-center gap-1" 
          onClick={onShowBCoefficientTable}
        >
          <TableIcon className="h-3 w-3" />
          Coefficient B: {bCoefficient.toFixed(2)}
        </Badge>
        {showImprovement && (
          <>
            <ArrowRight className="h-4 w-4 mx-2 text-green-600" />
            <Badge variant="success" className="ml-1">Amélioration: {improvementPercent.toFixed(1)}%</Badge>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {isAfterWork && onCopyBeforeToAfter && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-[#FEF7CD] text-[#806520] hover:bg-[#F3E9B0] border-[#E5D8A0]"
            onClick={onCopyBeforeToAfter}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            Copier les valeurs
          </Button>
        )}
        {isAfterWork && onAddSouflr47 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] border-[#8B5CF6]"
            onClick={onAddSouflr47}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Ajouter SOUFL'R 47
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={onAddLayer}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Ajouter couche
        </Button>
      </div>
    </div>
  );
};

export default LayerSectionHeader;
