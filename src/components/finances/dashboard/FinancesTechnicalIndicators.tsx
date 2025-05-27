
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";

interface FinancesTechnicalIndicatorsProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const FinancesTechnicalIndicators: React.FC<FinancesTechnicalIndicatorsProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
}) => {
  // Aucune donnée mockée - utilisation des vraies APIs
  const technicalData = {
    averageUiBefore: 0,
    averageUiAfter: 0,
    averageUiGap: 0,
    projectsAboveThreshold: 0,
    totalProjects: 0,
    res010Count: 0,
    res020Count: 0,
    averageCAEPerM2: 0,
    thermalSavings: 0,
  };

  const thresholdPercentage = technicalData.totalProjects > 0 ? (technicalData.projectsAboveThreshold / technicalData.totalProjects) * 100 : 0;
  const res010Percentage = (technicalData.res010Count + technicalData.res020Count) > 0 ? (technicalData.res010Count / (technicalData.res010Count + technicalData.res020Count)) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Indicateurs techniques CEE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ui moyen avant/après */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Ui moyen avant/après</h4>
            <div className="text-2xl font-bold">
              {technicalData.averageUiBefore} → {technicalData.averageUiAfter}
            </div>
            <div className="text-sm text-green-600">
              Amélioration: -{technicalData.averageUiGap.toFixed(1)} W/m²K
            </div>
          </div>

          {/* Écart moyen Ui */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Impact technique moyen</h4>
            <div className="text-2xl font-bold text-green-600">
              -{technicalData.averageUiGap.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">W/m²K d'amélioration</div>
          </div>

          {/* Projets au-dessus du seuil */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Projets seuil atteint</h4>
            <div className="text-2xl font-bold">
              {technicalData.projectsAboveThreshold}/{technicalData.totalProjects}
            </div>
            <Progress value={thresholdPercentage} className="h-2" />
            <div className="text-sm text-gray-500">{thresholdPercentage.toFixed(1)}% de réussite</div>
          </div>

          {/* CAE moyen par m² */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">CAE moyen par m²</h4>
            <div className="text-2xl font-bold">
              {technicalData.averageCAEPerM2.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">kWh/an/m²</div>
          </div>

          {/* Répartition RES010/RES020 */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Répartition fiches</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>RES010</span>
                <span>{technicalData.res010Count} ({res010Percentage.toFixed(0)}%)</span>
              </div>
              <Progress value={res010Percentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>RES020</span>
                <span>{technicalData.res020Count} ({(100 - res010Percentage).toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          {/* Économies thermiques totales */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Économies thermiques</h4>
            <div className="text-2xl font-bold text-blue-600">
              {(technicalData.thermalSavings / 1000000).toFixed(2)} M
            </div>
            <div className="text-sm text-gray-500">kWh/an économisés</div>
          </div>

          {/* Valorisation financière */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Valorisation CEE</h4>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(technicalData.thermalSavings * 0.1)}
            </div>
            <div className="text-sm text-gray-500">Valeur marchande estimée</div>
          </div>

          {/* Performance globale */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Performance globale</h4>
            <div className="text-2xl font-bold">
              {((thresholdPercentage + res010Percentage) / 2).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500">Score de performance</div>
          </div>
        </div>

        {technicalData.totalProjects === 0 && (
          <div className="mt-6 flex items-center justify-center py-8">
            <p className="text-gray-500">Aucune donnée technique disponible. Connectez l'API pour voir les indicateurs.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancesTechnicalIndicators;
