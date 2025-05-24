
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home, Zap, Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface FinancesKPICardsProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const FinancesKPICards: React.FC<FinancesKPICardsProps> = ({
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
    formatter,
    color = "blue"
  }: {
    title: string;
    value: number;
    unit?: string;
    icon: React.ReactNode;
    change: number;
    trend: "up" | "down";
    formatter?: (value: number) => string;
    color?: string;
  }) => {
    const formattedValue = formatter ? formatter(value) : value.toLocaleString();
    const isPositive = trend === "up";

    return (
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200">
        <CardContent className="p-4 lg:p-6">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate mb-2">{title}</p>
              <div className="flex items-baseline">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{formattedValue}</h3>
                {unit && <span className="ml-1 lg:ml-2 text-xs lg:text-sm text-gray-500">{unit}</span>}
              </div>
            </div>
            <div className={`p-2 ${color === "green" ? "bg-green-100" : color === "blue" ? "bg-blue-100" : color === "orange" ? "bg-orange-100" : "bg-gray-100"} rounded-lg flex-shrink-0 ml-3`}>
              {React.cloneElement(icon as React.ReactElement, { 
                className: `h-5 w-5 lg:h-6 lg:w-6 ${color === "green" ? "text-green-600" : color === "blue" ? "text-blue-600" : color === "orange" ? "text-orange-600" : "text-gray-600"}` 
              })}
            </div>
          </div>
          
          <div className="mt-3 lg:mt-4 flex items-center text-sm">
            <div className={`flex items-center px-2 py-1 rounded-full ${
              isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
            }`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              )}
              <span className="text-xs font-medium">{Math.abs(change)}%</span>
            </div>
            <span className="text-gray-500 ml-2 text-xs">vs mois précédent</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      <KPICard
        title="🧍 Clients actifs"
        value={kpiData.activeClients.value}
        unit="clients"
        icon={<Users />}
        change={kpiData.activeClients.change}
        trend={kpiData.activeClients.trend}
        color="blue"
      />
      
      <KPICard
        title="📏 Surface isolée totale"
        value={kpiData.totalSurface.value}
        unit="m²"
        icon={<Home />}
        change={kpiData.totalSurface.change}
        trend={kpiData.totalSurface.trend}
        color="green"
      />
      
      <KPICard
        title="⚡ CAE global"
        value={kpiData.totalCAE.value}
        unit="kWh/an"
        icon={<Zap />}
        change={kpiData.totalCAE.change}
        trend={kpiData.totalCAE.trend}
        color="orange"
        formatter={(value) => `${(value / 1000000).toFixed(2)} M`}
      />
      
      <KPICard
        title="💶 Économie moyenne"
        value={kpiData.averagePrice.value}
        unit="€/m²"
        icon={<Calculator />}
        change={kpiData.averagePrice.change}
        trend={kpiData.averagePrice.trend}
        color="green"
      />
    </div>
  );
};

export default FinancesKPICards;
