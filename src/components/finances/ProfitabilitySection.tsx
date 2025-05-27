
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

interface ProfitabilitySectionProps {
  selectedMonth: string;
}

const ProfitabilitySection: React.FC<ProfitabilitySectionProps> = ({
  selectedMonth,
}) => {
  // Aucune donnée mockée - utilisation des vraies APIs
  const profitabilityData = {
    laborCostPerUnit: 0,
    averageCostPerIntervention: 0,
    totalCostForPeriod: 0,
    totalRevenue: 0,
    grossMargin: 0,
    grossMarginPercent: 0,
  };

  // Aucune donnée mockée par délégataire
  const delegateData: any[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Rentabilité</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="summary">Résumé global</TabsTrigger>
            <TabsTrigger value="delegate">Par délégataire</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Coût main d'œuvre
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">{formatCurrency(profitabilityData.laborCostPerUnit)}/m²</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Coût moyen par intervention
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">
                    {formatCurrency(profitabilityData.averageCostPerIntervention)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Marge brute période
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(profitabilityData.grossMargin)}
                    <span className="text-sm ml-2">
                      ({profitabilityData.grossMarginPercent.toFixed(2)}%)
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Résumé financier - Période actuelle</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {profitabilityData.totalRevenue === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Aucune donnée financière disponible. Connectez l'API pour voir les données.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Élément</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Chiffre d'affaires total</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(profitabilityData.totalRevenue)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Coût total opérations</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(profitabilityData.totalCostForPeriod)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-t-2">
                        <TableCell className="font-bold">Marge brute</TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          {formatCurrency(profitabilityData.grossMargin)}
                          <span className="text-sm ml-2">
                            ({profitabilityData.grossMarginPercent.toFixed(2)}%)
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delegate">
            {delegateData.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Aucune donnée par délégataire disponible. Connectez l'API pour voir les données.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Délégataire</TableHead>
                    <TableHead className="text-center">Projets</TableHead>
                    <TableHead className="text-right">CA</TableHead>
                    <TableHead className="text-right">Coûts</TableHead>
                    <TableHead className="text-right">Marge</TableHead>
                    <TableHead className="text-right">Marge %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delegateData.map((delegate) => (
                    <TableRow key={delegate.name}>
                      <TableCell className="font-medium">{delegate.name}</TableCell>
                      <TableCell className="text-center">{delegate.projects}</TableCell>
                      <TableCell className="text-right">{formatCurrency(delegate.revenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(delegate.cost)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(delegate.margin)}
                      </TableCell>
                      <TableCell className="text-right">
                        {delegate.marginPercent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfitabilitySection;
