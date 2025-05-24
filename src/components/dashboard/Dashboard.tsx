
import React, { useState } from "react";
import DashboardFilters from "./DashboardFilters";
import DashboardKPICards from "./DashboardKPICards";
import DashboardCharts from "./DashboardCharts";
import DashboardTeamTable from "./DashboardTeamTable";
import DashboardTechnicalIndicators from "./DashboardTechnicalIndicators";
import DashboardExportActions from "./DashboardExportActions";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-05");
  const [selectedFicheType, setSelectedFicheType] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

  const handleRefresh = () => {
    console.log("Actualisation des données du tableau de bord");
  };

  const handleExportPDF = () => {
    console.log("Export PDF du tableau de bord");
  };

  const handleExportExcel = () => {
    console.log("Export Excel du tableau de bord");
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-6">
      {/* Zone de filtrage globale - Sticky en haut */}
      <DashboardFilters
        selectedPeriod={selectedPeriod}
        selectedFicheType={selectedFicheType}
        selectedTeam={selectedTeam}
        onPeriodChange={setSelectedPeriod}
        onFicheTypeChange={setSelectedFicheType}
        onTeamChange={setSelectedTeam}
        onRefresh={handleRefresh}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      {/* KPI Cards - Vue synthétique */}
      <div className="px-1 lg:px-0">
        <DashboardKPICards 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Graphiques / Courbes */}
      <div className="px-1 lg:px-0">
        <DashboardCharts 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Tableau Équipes / Projets */}
      <div className="px-1 lg:px-0">
        <DashboardTeamTable 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Indicateurs techniques CAE */}
      <div className="px-1 lg:px-0">
        <DashboardTechnicalIndicators 
          selectedPeriod={selectedPeriod}
          selectedFicheType={selectedFicheType}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Zone d'action & export global */}
      <div className="px-1 lg:px-0">
        <DashboardExportActions />
      </div>
    </div>
  );
};

export default Dashboard;
