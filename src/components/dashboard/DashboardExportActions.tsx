
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2 } from "lucide-react";

const DashboardExportActions = () => {
  const handleGenerateMonthlyReport = () => {
    console.log("Génération du rapport mensuel PDF");
  };

  const handleGlobalExcelExport = () => {
    console.log("Export Excel global avec tous les KPI et tableaux");
  };

  const handleShare = () => {
    console.log("Partage du tableau de bord");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">📤 Actions & Export Global</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleGenerateMonthlyReport}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            📄 Générer rapport mensuel
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGlobalExcelExport}
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            📊 Export Excel global
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            🔗 Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardExportActions;
