
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
  // Aucune donnée mockée - utilisation des vraies APIs
  const monthlyEvolution: any[] = [];
  const surfaceData: any[] = [];
  const ficheTypeDistribution: any[] = [];

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
          {monthlyEvolution.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">Aucune donnée disponible. Connectez l'API pour voir les graphiques.</p>
            </div>
          ) : (
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
          )}
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
          {monthlyEvolution.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">Aucune donnée disponible. Connectez l'API pour voir les graphiques.</p>
            </div>
          ) : (
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
          )}
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
          {surfaceData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">Aucune donnée disponible. Connectez l'API pour voir les graphiques.</p>
            </div>
          ) : (
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
          )}
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
          {ficheTypeDistribution.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">Aucune donnée disponible. Connectez l'API pour voir les graphiques.</p>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancesCharts;
