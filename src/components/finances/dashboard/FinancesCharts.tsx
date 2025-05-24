
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface FinancesChartsProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const FinancesCharts: React.FC<FinancesChartsProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
}) => {
  // Données mockées pour les graphiques
  const monthlyEvolution = [
    { month: "Jan", cae: 180000, facturation: 18000 },
    { month: "Fév", cae: 220000, facturation: 22000 },
    { month: "Mar", cae: 195000, facturation: 19500 },
    { month: "Avr", cae: 245000, facturation: 24500 },
    { month: "Mai", cae: 280000, facturation: 28000 },
  ];

  const surfaceData = [
    { month: "Jan", surface: 1200 },
    { month: "Fév", surface: 1450 },
    { month: "Mar", surface: 1320 },
    { month: "Avr", surface: 1680 },
    { month: "Mai", surface: 1890 },
  ];

  const ficheTypeDistribution = [
    { name: "RES010", value: 65, fill: "#8884d8" },
    { name: "RES020", value: 35, fill: "#82ca9d" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Évolution mensuelle des économies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Évolution mensuelle des économies (kWh/an)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} kWh`, "CAE"]}
              />
              <Line 
                type="monotone" 
                dataKey="cae" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: "#8884d8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Courbe de facturation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Facturation mensuelle (€)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} €`, "Facturation"]}
              />
              <Line 
                type="monotone" 
                dataKey="facturation" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={{ fill: "#82ca9d" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Histogramme des surfaces isolées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Surfaces isolées par mois (m²)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={surfaceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} m²`, "Surface"]}
              />
              <Bar dataKey="surface" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Répartition types de fiches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Répartition par type de fiche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ficheTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {ficheTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancesCharts;
