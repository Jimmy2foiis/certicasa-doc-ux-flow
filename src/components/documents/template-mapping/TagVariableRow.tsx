
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateTag, availableVariables } from "./types";

interface TagVariableRowProps {
  tag: TemplateTag;
  index: number;
  clientData?: any;
  updateCategory: (index: number, category: string) => void;
  updateMapping: (index: number, value: string) => void;
}

export const TagVariableRow = ({ 
  tag, 
  index, 
  clientData, 
  updateCategory, 
  updateMapping 
}: TagVariableRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-3">
        <Badge variant="outline" className="justify-center w-full overflow-hidden text-ellipsis">
          {tag.tag}
        </Badge>
      </div>
      
      <div className="col-span-1 flex justify-center">
        <span className="text-gray-400">→</span>
      </div>
      
      <div className="col-span-3">
        <Select 
          value={tag.category} 
          onValueChange={(value) => updateCategory(index, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(availableVariables).map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-4">
        <Select 
          value={tag.mappedTo.split('.')[1] || ''} 
          onValueChange={(value) => updateMapping(index, `${tag.category}.${value}`)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Variable" />
          </SelectTrigger>
          <SelectContent>
            {availableVariables[tag.category as keyof typeof availableVariables]?.map(variable => (
              <SelectItem key={variable} value={variable}>
                {variable}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-1 flex justify-center">
        {clientData && clientData[tag.category]?.[tag.mappedTo.split('.')[1]] ? (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            ✓
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            ?
          </Badge>
        )}
      </div>
    </div>
  );
};
