
import { Material } from "@/data/materials";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useMaterialsAndProducts } from "@/hooks/useMaterialsAndProducts";
import { MATERIAL_CATEGORIES } from "@/types/materials";

interface MaterialSelectorProps {
  onSelectMaterial: (material: Material) => void;
}

const MaterialSelector = ({ onSelectMaterial }: MaterialSelectorProps) => {
  const { materials, products, getActiveMaterials, getActiveProducts } = useMaterialsAndProducts();

  const getCategoryLabel = (categoryId: string) => {
    return MATERIAL_CATEGORIES.find(cat => cat.id === categoryId)?.label || categoryId;
  };

  const getMaterialsByCategory = (categoryId: string) => {
    return getActiveMaterials().filter(m => m.category === categoryId);
  };

  const getProductsByMaterial = (materialId: string) => {
    return getActiveProducts().filter(p => p.baseMaterialId === materialId);
  };

  const convertToLegacyMaterial = (material: any, isProduct = false): Material => {
    return {
      id: material.id,
      name: isProduct ? `${material.name} (${material.manufacturer})` : material.name,
      thickness: isProduct ? material.availableThicknesses[0] || 100 : 100,
      lambda: material.lambda,
      r: 0 // Sera calculé automatiquement
    };
  };

  return (
    <div className="border rounded-md p-3 bg-white">
      <h3 className="font-medium mb-3">Matériaux et produits disponibles</h3>
      <ScrollArea className="h-[320px] pr-3">
        <Accordion type="single" collapsible className="w-full">
          {MATERIAL_CATEGORIES.map((category) => {
            const categoryMaterials = getMaterialsByCategory(category.id);
            if (categoryMaterials.length === 0) return null;

            return (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="text-sm py-2">
                  {category.label} ({categoryMaterials.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categoryMaterials.map((material) => {
                      const relatedProducts = getProductsByMaterial(material.id);
                      
                      return (
                        <div key={material.id} className="space-y-1">
                          {/* Matériau de base */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-left h-auto p-2"
                            onClick={() => onSelectMaterial(convertToLegacyMaterial(material))}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{material.name}</span>
                              <span className="text-xs text-gray-500">λ = {material.lambda} W/m·K</span>
                            </div>
                            <Plus className="h-4 w-4" />
                          </Button>

                          {/* Produits basés sur ce matériau */}
                          {relatedProducts.length > 0 && (
                            <div className="ml-4 space-y-1">
                              {relatedProducts.map((product) => (
                                <Button
                                  key={product.id}
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-between text-left h-auto p-2 bg-blue-50"
                                  onClick={() => onSelectMaterial(convertToLegacyMaterial(product, true))}
                                >
                                  <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium">{product.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {product.manufacturer} • λ = {product.lambda} W/m·K
                                    </span>
                                    <div className="flex gap-1 mt-1">
                                      {product.availableThicknesses.slice(0, 3).map(thickness => (
                                        <Badge key={thickness} variant="outline" className="text-xs py-0">
                                          {thickness}mm
                                        </Badge>
                                      ))}
                                      {product.availableThicknesses.length > 3 && (
                                        <Badge variant="outline" className="text-xs py-0">
                                          +{product.availableThicknesses.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default MaterialSelector;
