
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predefinedMaterials } from "@/data/materials";

interface MaterialSelectProps {
  currentName: string;
  onMaterialSelect: (materialId: string) => void;
}

const MaterialSelect = ({ currentName, onMaterialSelect }: MaterialSelectProps) => {
  return (
    <Select onValueChange={onMaterialSelect} defaultValue="">
      <SelectTrigger className="h-8">
        <SelectValue placeholder={currentName} />
      </SelectTrigger>
      <SelectContent>
        {predefinedMaterials.map((material) => (
          <SelectItem key={material.id} value={material.id}>{material.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MaterialSelect;
