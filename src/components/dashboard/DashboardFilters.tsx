
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
    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-4 -mx-4 lg:-mx-6 mb-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Filtres principaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Sélecteur de période */}
              <div className="w-full">
                <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                  <SelectTrigger className="w-full border-gray-300 bg-white">
                    <SelectValue placeholder="Sélectionner période" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par type de fiche */}
              <div className="w-full">
                <Select value={selectedFicheType} onValueChange={onFicheTypeChange}>
                  <SelectTrigger className="w-full border-gray-300 bg-white">
                    <SelectValue placeholder="Type de fiche" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-50">Tous types</SelectItem>
                    <SelectItem value="RES010" className="hover:bg-gray-50">RES010</SelectItem>
                    <SelectItem value="RES020" className="hover:bg-gray-50">RES020</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par équipe */}
              <div className="w-full">
                <Select value={selectedTeam} onValueChange={onTeamChange}>
                  <SelectTrigger className="w-full border-gray-300 bg-white">
                    <SelectValue placeholder="Équipe" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-50">Toutes les équipes</SelectItem>
                    <SelectItem value="artisol" className="hover:bg-gray-50">ARTISOL</SelectItem>
                    <SelectItem value="renovation-plus" className="hover:bg-gray-50">Rénovation Plus</SelectItem>
                    <SelectItem value="eco-habitat" className="hover:bg-gray-50">Éco Habitat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton actualiser */}
              <div className="w-full">
                <Button variant="outline" onClick={onRefresh} className="w-full border-gray-300 hover:bg-gray-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>

            {/* Actions d'export */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button variant="outline" onClick={onExportExcel} className="w-full sm:w-auto text-sm border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={onExportPDF} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm text-white">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardFilters;
