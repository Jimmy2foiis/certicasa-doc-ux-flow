
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { availableVariables } from "./types";

export interface VariableCategoryTabsProps {
  clientData: any;
  onVariableSelect: (variable: string) => void;
}

export const VariableCategoryTabs = ({ clientData, onVariableSelect }: VariableCategoryTabsProps) => {
  const [activeCategory, setActiveCategory] = useState("client");
  
  return (
    <div>
      <h3 className="font-medium mb-3">Variables disponibles</h3>
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-2">
          {Object.keys(availableVariables).map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(availableVariables).map(([category, variables]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {variables.map(variable => (
                  <Badge 
                    key={variable} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-slate-200"
                    onClick={() => onVariableSelect(`${category}.${variable}`)}
                  >
                    {`${category}.${variable}`}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
