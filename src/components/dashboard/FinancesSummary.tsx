
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Zap, Calculator, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinancesSummary = () => {
  const navigate = useNavigate();

  // Données mockées pour le résumé financier
  const financeData = {
    activeClients: { value: 245, change: 12, trend: "up" as const },
    totalSurface: { value: 18500, change: 8, trend: "up" as const },
    totalCAE: { value: 1240000, change: 23, trend: "up" as const },
    averagePrice: { value: 42, change: -3, trend: "down" as const },
    monthlyRevenue: 98400,
    projectsCompleted: 37,
  };

  const KPICard = ({ 
    title, 
    value, 
    unit, 
    icon, 
    change, 
    trend, 
    formatter 
  }: {
    title: string;
    value: number;
    unit?: string;
    icon: React.ReactNode;
    change: number;
    trend: "up" | "down";
    formatter?: (value: number) => string;
  }) => {
    const formattedValue = formatter ? formatter(value) : value.toLocaleString();
    const isPositive = trend === "up";

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-xl font-bold">{formattedValue}</h3>
                {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
              </div>
            </div>
            <div className="p-2 bg-gray-100 rounded-md">
              {icon}
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs">
            <div className={`flex items-center px-1.5 py-0.5 rounded ${
              isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
            }`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
            <span className="text-muted-foreground ml-1.5">vs mois précédent</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Performance Financière
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/finances')}
          >
            Voir détails
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Clients actifs"
            value={financeData.activeClients.value}
            unit="clients"
            icon={<Users className="h-5 w-5" />}
            change={financeData.activeClients.change}
            trend={financeData.activeClients.trend}
          />
          
          <KPICard
            title="Surface isolée"
            value={financeData.totalSurface.value}
            unit="m²"
            icon={<Home className="h-5 w-5" />}
            change={financeData.totalSurface.change}
            trend={financeData.totalSurface.trend}
          />
          
          <KPICard
            title="CAE total"
            value={financeData.totalCAE.value}
            unit="kWh/an"
            icon={<Zap className="h-5 w-5" />}
            change={financeData.totalCAE.change}
            trend={financeData.totalCAE.trend}
            formatter={(value) => `${(value / 1000000).toFixed(2)} M`}
          />
          
          <KPICard
            title="Moyenne"
            value={financeData.averagePrice.value}
            unit="€/m²"
            icon={<Calculator className="h-5 w-5" />}
            change={financeData.averagePrice.change}
            trend={financeData.averagePrice.trend}
          />
        </div>

        {/* Résumé rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-muted-foreground">Chiffre d'affaires mensuel</span>
            <span className="font-medium">{formatCurrency(financeData.monthlyRevenue)}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-muted-foreground">Projets terminés ce mois</span>
            <span className="font-medium">{financeData.projectsCompleted}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancesSummary;
