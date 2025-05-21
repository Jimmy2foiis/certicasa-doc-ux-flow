import { Badge } from "@/components/ui/badge";
import { TagVariableRow } from "./TagVariableRow";
import { TemplateTag } from "@/components/documents/template-mapping/types";

interface TagsListProps {
  tags: TemplateTag[];
  clientData?: any;
  updateCategory: (index: number, category: string) => void;
  updateMapping: (index: number, value: string) => void;
}

export const TagsList = ({ 
  tags, 
  clientData, 
  updateCategory, 
  updateMapping 
}: TagsListProps) => {
  if (tags.length === 0) {
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
      <h3 className="font-medium mb-3">Balises détectées ({tags.length})</h3>
      <div className="space-y-3">
        {tags.map((tag, index) => (
          <TagVariableRow 
            key={index}
            tag={tag}
            index={index}
            clientData={clientData}
            updateCategory={updateCategory}
            updateMapping={updateMapping}
          />
        ))}
      </div>
    </div>
  );
};
