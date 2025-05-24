
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, TrendingUp, TrendingDown, Users, Home, Zap, Calculator, FileText, Share } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
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
            <DashboardCharts
              selectedPeriod={selectedPeriod}
              selectedFicheType={selectedFicheType}
              selectedTeam={selectedTeam}
            />

            {/* Tableau des équipes */}
            <DashboardTeamTable
              selectedPeriod={selectedPeriod}
              selectedFicheType={selectedFicheType}
              selectedTeam={selectedTeam}
            />

            {/* Indicateurs techniques */}
            <DashboardTechnicalIndicators
              selectedPeriod={selectedPeriod}
              selectedFicheType={selectedFicheType}
              selectedTeam={selectedTeam}
            />

            {/* Zone d'actions globales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Actions globales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Générer rapport mensuel PDF
                  </Button>
                  <Button variant="outline" onClick={handleExportExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel global
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
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
