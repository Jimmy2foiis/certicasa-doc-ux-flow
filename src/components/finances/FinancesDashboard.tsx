
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw } from "lucide-react";
import FinancesKPICards from "./dashboard/FinancesKPICards";
import FinancesCharts from "./dashboard/FinancesCharts";
import FinancesTeamTable from "./dashboard/FinancesTeamTable";
import FinancesTechnicalIndicators from "./dashboard/FinancesTechnicalIndicators";

interface PeriodOption {
  value: string;
  label: string;
}

const FinancesDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-05");
  const [selectedFicheType, setSelectedFicheType] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

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

  const handleExportPDF = () => {
    console.log("Export PDF du tableau de bord");
  };

  const handleExportExcel = () => {
    console.log("Export Excel du tableau de bord");
  };

  const handleRefresh = () => {
    console.log("Actualisation des données");
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Zone de contrôle sticky - Optimisée pour mobile */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 -mx-4 lg:p-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-3 lg:p-4">
            {/* Filtres - Stack vertical sur mobile */}
            <div className="space-y-3 lg:space-y-0 lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-4">
              <div className="space-y-3 lg:space-y-0 lg:flex lg:flex-wrap lg:items-center lg:gap-3">
                {/* Sélecteur de période */}
                <div className="w-full lg:w-48">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
                <div className="w-full lg:w-40">
                  <Select value={selectedFicheType} onValueChange={setSelectedFicheType}>
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
                <div className="w-full lg:w-48">
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
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

                <Button variant="outline" onClick={handleRefresh} className="w-full lg:w-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>

              {/* Actions d'export - Stack sur mobile */}
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-2">
                <Button variant="outline" onClick={handleExportExcel} className="w-full sm:w-auto text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="sm:hidden">Excel</span>
                </Button>
                <Button onClick={handleExportPDF} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards - Responsive grid */}
      <div className="px-1 lg:px-0">
        <FinancesKPICards 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Graphiques analytiques - Container avec scroll horizontal sur mobile */}
      <div className="px-1 lg:px-0">
        <FinancesCharts 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Tableau des équipes - Scroll horizontal sur mobile */}
      <div className="px-1 lg:px-0 overflow-x-auto">
        <FinancesTeamTable 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Indicateurs techniques CEE */}
      <div className="px-1 lg:px-0">
        <FinancesTechnicalIndicators 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>
    </div>
  );
};

export default FinancesDashboard;
