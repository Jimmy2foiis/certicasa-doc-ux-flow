
import React from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface DossierFiltersProps {
  responsibleFilter: string;
  setResponsibleFilter: (value: string) => void;
  responsibleCount: {
    all: number;
    [key: string]: number;
  };
}

const DossierFilters = ({ 
  responsibleFilter, 
  setResponsibleFilter, 
  responsibleCount 
}: DossierFiltersProps) => {
  
  return (
    <div className="flex items-center mb-6">
      <div className="w-64">
        <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Filtrer par responsable" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">
                Tous [{responsibleCount.all}]
              </SelectItem>
              <SelectItem value="Anna Latour">
                Anna Latour [{responsibleCount["Anna Latour"]}]
              </SelectItem>
              <SelectItem value="Marc Moreno">
                Marc Moreno [{responsibleCount["Marc Moreno"]}]
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DossierFilters;
