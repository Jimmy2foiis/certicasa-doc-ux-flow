
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    activeClients: { value: 245, change: 12, trend: "up" },
    totalSurface: { value: 18500, change: 8, trend: "up" },
    totalCAE: { value: 1240000, change: 23, trend: "up" },
    averagePrice: { value: 42, change: -3, trend: "down" },
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
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{formattedValue}</h3>
                {unit && <span className="ml-1 text-muted-foreground">{unit}</span>}
              </div>
            </div>
            <div className="p-2 bg-gray-100 rounded-md">
              {icon}
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-sm">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Clients actifs"
        value={kpiData.activeClients.value}
        unit="clients"
        icon={<Users className="h-6 w-6" />}
        change={kpiData.activeClients.change}
        trend={kpiData.activeClients.trend}
      />
      
      <KPICard
        title="Surface totale isolée"
        value={kpiData.totalSurface.value}
        unit="m²"
        icon={<Home className="h-6 w-6" />}
        change={kpiData.totalSurface.change}
        trend={kpiData.totalSurface.trend}
      />
      
      <KPICard
        title="CAE total"
        value={kpiData.totalCAE.value}
        unit="kWh/an"
        icon={<Zap className="h-6 w-6" />}
        change={kpiData.totalCAE.change}
        trend={kpiData.totalCAE.trend}
        formatter={(value) => `${(value / 1000000).toFixed(2)} M`}
      />
      
      <KPICard
        title="Moyenne"
        value={kpiData.averagePrice.value}
        unit="€/m²"
        icon={<Calculator className="h-6 w-6" />}
        change={kpiData.averagePrice.change}
        trend={kpiData.averagePrice.trend}
      />
    </div>
  );
};

export default FinancesKPICards;
