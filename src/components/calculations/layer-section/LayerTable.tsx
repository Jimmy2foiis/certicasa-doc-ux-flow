
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LayerRow from "../LayerRow";
import { Material } from "@/data/materials";
import { Layer } from "@/hooks/useLayerManagement";

interface LayerTableProps {
  layers: Layer[];
  onDelete: (id: string) => void;
  onUpdate: (updatedLayer: Layer) => void;
}

const LayerTable = ({ layers, onDelete, onUpdate }: LayerTableProps) => {
  return (
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
              onDelete={() => onDelete(layer.id)}
              onUpdate={(updatedLayer) => onUpdate(updatedLayer)}
              isNew={layer.isNew}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LayerTable;
