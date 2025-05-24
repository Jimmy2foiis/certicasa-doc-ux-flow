
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw } from "lucide-react";

interface DashboardFiltersProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
  onPeriodChange: (value: string) => void;
  onFicheTypeChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  onRefresh: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

interface PeriodOption {
  value: string;
  label: string;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
  onPeriodChange,
  onFicheTypeChange,
  onTeamChange,
  onRefresh,
  onExportPDF,
  onExportExcel,
}) => {
  const generatePeriodOptions = (): PeriodOption[] => {
    const options: PeriodOption[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;
      
      const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      const label = `${monthNames[date.getMonth()]} ${year}`;
      
      options.push({ value, label });
    }
    
    return options;
  };

  const periodOptions = generatePeriodOptions();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 sm:p-4 -mx-3 sm:-mx-6 mb-4 sm:mb-6">
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-4">
            {/* Filtres principaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Sélecteur de période */}
              <div className="w-full">
                <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner période" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par type de fiche */}
              <div className="w-full">
                <Select value={selectedFicheType} onValueChange={onFicheTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type de fiche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="RES010">RES010</SelectItem>
                    <SelectItem value="RES020">RES020</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par équipe */}
              <div className="w-full">
                <Select value={selectedTeam} onValueChange={onTeamChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les équipes</SelectItem>
                    <SelectItem value="artisol">ARTISOL</SelectItem>
                    <SelectItem value="renovation-plus">Rénovation Plus</SelectItem>
                    <SelectItem value="eco-habitat">Éco Habitat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton actualiser */}
              <div className="w-full sm:w-auto">
                <Button variant="outline" onClick={onRefresh} className="w-full sm:w-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Actualiser</span>
                  <span className="sm:hidden">Actualiser</span>
                </Button>
              </div>
            </div>

            {/* Actions d'export */}
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button variant="outline" onClick={onExportExcel} className="w-full sm:w-auto text-sm">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export Excel</span>
                <span className="sm:hidden">Excel</span>
              </Button>
              <Button onClick={onExportPDF} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardFilters;
