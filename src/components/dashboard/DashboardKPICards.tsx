
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home, Zap, Calculator, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardKPICardsProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const DashboardKPICards: React.FC<DashboardKPICardsProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
}) => {
  // Données mockées pour l'exemple
  const kpiData = {
    activeClients: { value: 245, change: 12, trend: "up" as const },
    totalSurface: { value: 18500, change: 8, trend: "up" as const },
    totalCAE: { value: 1240000, change: 23, trend: "up" as const },
    averagePrice: { value: 42, change: -3, trend: "down" as const },
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
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{formattedValue}</h3>
                {unit && <span className="ml-1 text-xs sm:text-sm text-muted-foreground">{unit}</span>}
              </div>
            </div>
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-md flex-shrink-0 ml-2">
              {React.cloneElement(icon as React.ReactElement, { 
                className: "h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
              })}
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <div className={`flex items-center px-1 sm:px-1.5 py-0.5 rounded ${
              isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
            }`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span className="text-xs">{Math.abs(change)}%</span>
            </div>
            <span className="text-muted-foreground ml-1.5 text-xs hidden sm:inline">vs mois précédent</span>
            <span className="text-muted-foreground ml-1.5 text-xs sm:hidden">vs M-1</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <KPICard
        title="🧍 Clients actifs"
        value={kpiData.activeClients.value}
        unit="clients"
        icon={<Users />}
        change={kpiData.activeClients.change}
        trend={kpiData.activeClients.trend}
      />
      
      <KPICard
        title="📏 Surface isolée totale"
        value={kpiData.totalSurface.value}
        unit="m²"
        icon={<Home />}
        change={kpiData.totalSurface.change}
        trend={kpiData.totalSurface.trend}
      />
      
      <KPICard
        title="⚡ CAE global"
        value={kpiData.totalCAE.value}
        unit="kWh/an"
        icon={<Zap />}
        change={kpiData.totalCAE.change}
        trend={kpiData.totalCAE.trend}
        formatter={(value) => `${(value / 1000000).toFixed(2)} M`}
      />
      
      <KPICard
        title="💶 Économie moyenne"
        value={kpiData.averagePrice.value}
        unit="€/m²"
        icon={<Calculator />}
        change={kpiData.averagePrice.change}
        trend={kpiData.averagePrice.trend}
      />
    </div>
  );
};

export default DashboardKPICards;
