
import { Badge } from "@/components/ui/badge";
import { TagVariableRow } from "./TagVariableRow";
import { TemplateTag } from "@/types/documents";

export interface TagsListProps {
  mappings: TemplateTag[];
  onMappingsChange: (updatedMappings: TemplateTag[]) => void;
}

export const TagsList = ({ mappings, onMappingsChange }: TagsListProps) => {
  // Handle category update
  const updateCategory = (index: number, category: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index].category = category;
    
    // Also update mappedTo to reflect new category
    const currentField = updatedMappings[index].mappedTo.split('.')[1];
    updatedMappings[index].mappedTo = `${category}.${currentField}`;
    
    onMappingsChange(updatedMappings);
  };
  
  // Handle mapping update
  const updateMapping = (index: number, value: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index].mappedTo = value;
    onMappingsChange(updatedMappings);
  };
  
  if (mappings.length === 0) {
    return (
      <div className="border border-dashed rounded-md p-8 text-center">
        <p className="text-gray-500">
          Aucune balise n'a été détectée dans ce modèle de document.
          <br />
          Ajoutez des balises manuellement ou sélectionnez un autre modèle.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-3">Balises détectées ({mappings.length})</h3>
      <div className="space-y-3">
        {mappings.map((tag, index) => (
          <TagVariableRow 
            key={index}
            tag={tag}
            index={index}
            updateCategory={updateCategory}
            updateMapping={updateMapping}
          />
        ))}
      </div>
    </div>
  );
};
