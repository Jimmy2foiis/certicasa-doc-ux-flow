
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Share } from "lucide-react";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import DashboardKPICards from "@/components/dashboard/DashboardKPICards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardTeamTable from "@/components/dashboard/DashboardTeamTable";
import DashboardTechnicalIndicators from "@/components/dashboard/DashboardTechnicalIndicators";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const MainDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-05");
  const [selectedFicheType, setSelectedFicheType] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

  const handleExportPDF = () => {
    console.log("Export PDF du rapport mensuel");
  };

  const handleExportExcel = () => {
    console.log("Export Excel global");
  };

  const handleShare = () => {
    console.log("Partager le tableau de bord");
  };

  const handleRefresh = () => {
    console.log("Actualisation des données");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-4 lg:p-6">
            {/* Zone de filtrage sticky */}
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

            {/* KPI Cards */}
            <DashboardKPICards
              selectedPeriod={selectedPeriod}
              selectedFicheType={selectedFicheType}
              selectedTeam={selectedTeam}
            />

            {/* Graphiques */}
            <div className="w-full overflow-hidden">
              <DashboardCharts
                selectedPeriod={selectedPeriod}
                selectedFicheType={selectedFicheType}
                selectedTeam={selectedTeam}
              />
            </div>

            {/* Tableau des équipes */}
            <div className="w-full overflow-hidden">
              <DashboardTeamTable
                selectedPeriod={selectedPeriod}
                selectedFicheType={selectedFicheType}
                selectedTeam={selectedTeam}
              />
            </div>

            {/* Indicateurs techniques */}
            <div className="w-full overflow-hidden">
              <DashboardTechnicalIndicators
                selectedPeriod={selectedPeriod}
                selectedFicheType={selectedFicheType}
                selectedTeam={selectedTeam}
              />
            </div>

            {/* Zone d'actions globales */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-gray-900">Actions globales</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleExportPDF} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Générer rapport mensuel PDF</span>
                    <span className="sm:hidden">Rapport PDF</span>
                  </Button>
                  <Button variant="outline" onClick={handleExportExcel} className="w-full sm:w-auto text-sm border-gray-300 hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Export Excel global</span>
                    <span className="sm:hidden">Export Excel</span>
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="w-full sm:w-auto text-sm border-gray-300 hover:bg-gray-50">
                    <Share className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;
