
import { Material, predefinedMaterials } from "@/data/materials";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

interface MaterialSelectorProps {
  onSelectMaterial: (material: Material) => void;
}

const MaterialSelector = ({ onSelectMaterial }: MaterialSelectorProps) => {
  const materialCategories = [
    { id: "structural", name: "Éléments structurels", materials: predefinedMaterials.filter(m => ["concrete_reinforced", "concrete", "concrete_filling", "wood"].includes(m.id)) },
    { id: "masonry", name: "Maçonnerie", materials: predefinedMaterials.filter(m => ["hollow_brick"].includes(m.id)) },
    { id: "finishes", name: "Finitions", materials: predefinedMaterials.filter(m => ["plaster", "plaster_mortar"].includes(m.id)) },
    { id: "insulation", name: "Isolation", materials: predefinedMaterials.filter(m => ["eps_insulation", "mineral_wool", "polyurethane"].includes(m.id)) },
    { id: "other", name: "Autres", materials: predefinedMaterials.filter(m => ["air"].includes(m.id)) },
  ];

  return (
    <div className="border rounded-md p-3 bg-white">
      <h3 className="font-medium mb-3">Matériaux disponibles</h3>
      <ScrollArea className="h-[320px] pr-3">
        <Accordion type="single" collapsible className="w-full">
          {materialCategories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-sm py-2">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {category.materials.map((material) => (
                    <Button
                      key={material.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-left"
                      onClick={() => onSelectMaterial(material)}
                    >
                      <span className="truncate">{material.name}</span>
                      <Plus className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default MaterialSelector;
