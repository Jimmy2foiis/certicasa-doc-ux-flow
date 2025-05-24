
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DashboardChartsProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
}) => {
  // Données mockées pour les graphiques
  const caeEvolutionData = [
    { month: 'Jan', cae: 95000 },
    { month: 'Fév', cae: 110000 },
    { month: 'Mar', cae: 125000 },
    { month: 'Avr', cae: 135000 },
    { month: 'Mai', cae: 148000 },
    { month: 'Jun', cae: 142000 },
  ];

  const surfaceData = [
    { month: 'Jan', surface: 1200 },
    { month: 'Fév', surface: 1450 },
    { month: 'Mar', surface: 1680 },
    { month: 'Avr', surface: 1820 },
    { month: 'Mai', surface: 1950 },
    { month: 'Jun', surface: 1890 },
  ];

  const facturationData = [
    { month: 'Jan', client: 78000, delegataire: 45000 },
    { month: 'Fév', client: 92000, delegataire: 52000 },
    { month: 'Mar', client: 105000, delegataire: 58000 },
    { month: 'Avr', client: 118000, delegataire: 65000 },
    { month: 'Mai', client: 132000, delegataire: 72000 },
    { month: 'Jun', client: 128000, delegataire: 69000 },
  ];

  const repartitionData = [
    { name: 'RES010', value: 65, count: 156 },
    { name: 'RES020', value: 35, count: 84 },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Évolution CAE mensuel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Évolution CAE mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={caeEvolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} kWh`, 'CAE']} />
              <Line type="monotone" dataKey="cae" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Surface posée par mois */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Surface posée par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={surfaceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} m²`, 'Surface']} />
              <Bar dataKey="surface" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Facturation client vs délégataire */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Facturation client vs délégataire</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={facturationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} €`, '']} />
              <Legend />
              <Line type="monotone" dataKey="client" stroke="#8884d8" strokeWidth={2} name="Client" />
              <Line type="monotone" dataKey="delegataire" stroke="#82ca9d" strokeWidth={2} name="Délégataire" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Répartition RES010/RES020 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Répartition par programme</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repartitionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, value}) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {repartitionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
