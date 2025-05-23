
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FinancesFiltersProps {
  selectedMonth: string;
  selectedStatuses: string[];
  searchTerm: string;
  onFilterChange: (month: string, statuses: string[], search: string) => void;
  onExportSelected: () => void;
}

interface MonthOption {
  value: string;
  label: string;
}

const FinancesFilters: React.FC<FinancesFiltersProps> = ({
  selectedMonth,
  selectedStatuses,
  searchTerm,
  onFilterChange,
  onExportSelected,
}) => {
  // Générer les 24 derniers mois pour le filtre
  const generateMonthOptions = (): MonthOption[] => {
    const options: MonthOption[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;
      
      // Format pour l'affichage: "Mai 2025"
      const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      const label = `${monthNames[date.getMonth()]} ${year}`;
      
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  const statuses = [
    { id: "generated", label: "Générée" },
    { id: "missing", label: "Manquante" },
    { id: "error", label: "Erreur" },
    { id: "not-generated", label: "Non générée" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(selectedMonth, selectedStatuses, e.target.value);
  };

  const handleMonthChange = (month: string) => {
    onFilterChange(month, selectedStatuses, searchTerm);
  };

  const handleStatusChange = (status: string) => {
    let newStatuses;
    if (selectedStatuses.includes(status)) {
      newStatuses = selectedStatuses.filter((s) => s !== status);
    } else {
      newStatuses = [...selectedStatuses, status];
    }
    onFilterChange(selectedMonth, newStatuses, searchTerm);
  };

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-4 p-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Filtre par mois */}
          <div className="w-48">
            <Select
              value={selectedMonth}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner période" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par statut */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Statuts ({selectedStatuses.length || "Tous"})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={status.id}
                        checked={selectedStatuses.includes(status.id)}
                        onCheckedChange={() => handleStatusChange(status.id)}
                      />
                      <Label htmlFor={status.id}>{status.label}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Recherche */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par client, no fiche..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <Button onClick={onExportSelected}>
            <Download className="h-4 w-4 mr-2" />
            Exporter sélection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancesFilters;
