
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight, Table as TableIcon, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LayerRow from "./LayerRow";
import { Material } from "@/data/materials";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  VentilationType, 
  getBCoefficientTableData, 
  bCoefficientTable, 
  calculateUpValue 
} from "@/utils/calculationUtils";
import { useState } from "react";

interface Layer extends Material {
  isNew?: boolean;
}

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
  onAddSouflr47?: () => void;  // Prop pour ajouter SOUFL'R 47
  lockVentilationType?: boolean; // Prop pour verrouiller le type de ventilation
  onCopyBeforeToAfter?: () => void; // Nouvelle prop pour la fonction de copie
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
  const bCoefficientTableData = getBCoefficientTableData();
  
  // Calcul du Up (transmittance avant coefficient b)
  const upValue = calculateUpValue(totalR);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <div className="flex items-center flex-wrap">
          <h3 className="font-medium">{title}</h3>
          <Badge 
            variant="outline" 
            className="ml-2 cursor-pointer flex items-center gap-1" 
            onClick={() => setShowBCoefficientTable(!showBCoefficientTable)}
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
            onClick={() => onAddLayer({ id: Date.now().toString(), name: "Sélectionnez un matériau", thickness: 10, lambda: 0.5, r: 0.02 })}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Ajouter couche
          </Button>
        </div>
      </div>
      
      {/* RSI et RSE */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`rsi-${isAfterWork ? 'after' : 'before'}`}>RSI (m²K/W)</Label>
          <Input
            id={`rsi-${isAfterWork ? 'after' : 'before'}`}
            value={rsi}
            onChange={(e) => setRsi(e.target.value)}
            type="number"
            step="0.01"
            placeholder="0.10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`rse-${isAfterWork ? 'after' : 'before'}`}>RSE (m²K/W)</Label>
          <Input
            id={`rse-${isAfterWork ? 'after' : 'before'}`}
            value={rse}
            onChange={(e) => setRse(e.target.value)}
            type="number"
            step="0.01"
            placeholder="0.10"
          />
        </div>
      </div>
      
      {/* Type de ventilation et Ratio */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`ventilation-${isAfterWork ? 'after' : 'before'}`}>Type de ventilation</Label>
          <Select 
            value={ventilationType}
            onValueChange={(value: VentilationType) => setVentilationType(value)}
          >
            <SelectTrigger id={`ventilation-${isAfterWork ? 'after' : 'before'}`}>
              <SelectValue placeholder="Sélectionner ventilation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caso1">Légèrement ventilé (Caso 1)</SelectItem>
              <SelectItem value="caso2">Très ventilé (Caso 2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`ratio-${isAfterWork ? 'after' : 'before'}`}>Ratio Combles/Toiture: {ratioValue.toFixed(2)}</Label>
          <Input
            id={`ratio-${isAfterWork ? 'after' : 'before'}`}
            value={ratioValue.toString()}
            onChange={(e) => setRatioValue(parseFloat(e.target.value) || 0)}
            type="number"
            step="0.01"
          />
        </div>
      </div>
      
      {/* Tableau des coefficients B */}
      {showBCoefficientTable && (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ratio Combles/Toiture</TableHead>
                <TableHead>
                  Coefficient B {isAfterWork ? "(après)" : "(avant)"} - {ventilationType === "caso1" ? "Légèrement ventilé" : "Très ventilé"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bCoefficientTableData.map((item, index) => (
                <TableRow 
                  key={index} 
                  className={
                    (ratioValue >= bCoefficientTable[index].min && (bCoefficientTable[index].max === null || ratioValue < bCoefficientTable[index].max)) 
                    ? "bg-green-50" 
                    : ""
                  }
                >
                  <TableCell>{item.range}</TableCell>
                  <TableCell>{isAfterWork 
                    ? (ventilationType === "caso1" ? item.caso1AfterWork : item.caso2AfterWork)
                    : (ventilationType === "caso1" ? item.caso1 : item.caso2)
                  }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matériau</TableHead>
              <TableHead className="w-[200px]">Épaisseur (m)</TableHead>
              <TableHead className="w-[120px]">λ (W/mK)</TableHead>
              <TableHead className="w-[120px]">R (m²K/W)</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {layers.map((layer) => (
              <LayerRow 
                key={layer.id} 
                layer={layer}
                onDelete={() => onDeleteLayer(layer.id)}
                onUpdate={(updatedLayer) => onUpdateLayer(updatedLayer)}
                isNew={layer.isNew}
              />
            ))}
          </TableBody>
        </Table>
        
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Résistance thermique totale (avec Rsi + Rse):</span>
              <span className="ml-2 font-medium">{totalR.toFixed(3)} m²K/W</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Up (transmittance avant coefficient b):</span>
              <span className="ml-2 font-medium">{upValue.toFixed(3)} W/m²K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Coefficient b:</span>
              <span className="ml-2 font-medium">{bCoefficient.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span className="text-sm">
                {isAfterWork ? "Uf (transmittance après coefficient b)" : "Ui (transmittance après coefficient b)"}:
              </span>
              <span className="ml-2">{uValue.toFixed(3)} W/m²K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSection;
