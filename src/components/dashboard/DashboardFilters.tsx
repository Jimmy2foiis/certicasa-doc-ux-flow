
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
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 -mx-6 mb-6">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sélecteur de période */}
            <div className="w-48">
              <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                <SelectTrigger>
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
            <div className="w-40">
              <Select value={selectedFicheType} onValueChange={onFicheTypeChange}>
                <SelectTrigger>
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
            <div className="w-48">
              <Select value={selectedTeam} onValueChange={onTeamChange}>
                <SelectTrigger>
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

            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>

          {/* Actions d'export */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={onExportPDF} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardFilters;
