
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, TrendingUp, TrendingDown, Users, Home, Zap, Calculator } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import FinancesKPICards from "./dashboard/FinancesKPICards";
import FinancesCharts from "./dashboard/FinancesCharts";
import FinancesTeamTable from "./dashboard/FinancesTeamTable";
import FinancesTechnicalIndicators from "./dashboard/FinancesTechnicalIndicators";

const FinancesDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-05");
  const [selectedFicheType, setSelectedFicheType] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

  const generatePeriodOptions = () => {
    const options = [];
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

  const teams = [
    { value: "all", label: "Toutes les équipes" },
    { value: "artisol", label: "ARTISOL" },
    { value: "renovation-plus", label: "Rénovation Plus" },
    { value: "eco-habitat", label: "Éco Habitat" },
  ];

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
    <div className="space-y-6">
      {/* Zone de contrôle sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 -mx-4">
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Sélecteur de période */}
              <div className="w-48">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
                <Select value={selectedFicheType} onValueChange={setSelectedFicheType}>
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
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.value} value={team.value}>
                        {team.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>

            {/* Actions d'export */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <FinancesKPICards 
        selectedPeriod={selectedPeriod}
        selectedFicheType={selectedFicheType}
        selectedTeam={selectedTeam}
      />

      {/* Graphiques analytiques */}
      <FinancesCharts 
        selectedPeriod={selectedPeriod}
        selectedFicheType={selectedFicheType}
        selectedTeam={selectedTeam}
      />

      {/* Tableau des équipes */}
      <FinancesTeamTable 
        selectedPeriod={selectedPeriod}
        selectedFicheType={selectedFicheType}
        selectedTeam={selectedTeam}
      />

      {/* Indicateurs techniques CEE */}
      <FinancesTechnicalIndicators 
        selectedPeriod={selectedPeriod}
        selectedFicheType={selectedFicheType}
        selectedTeam={selectedTeam}
      />
    </div>
  );
};

export default FinancesDashboard;
