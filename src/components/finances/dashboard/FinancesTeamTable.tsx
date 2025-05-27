
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface FinancesTeamTableProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const FinancesTeamTable: React.FC<FinancesTeamTableProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
}) => {
  // Aucune donnée mockée - utilisation des vraies APIs
  const teamData: any[] = [];

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 80) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Performance des équipes de pose
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teamData.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Aucune donnée d'équipe disponible. Connectez l'API pour voir les données.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipe de pose</TableHead>
                <TableHead className="text-right">Projets terminés</TableHead>
                <TableHead className="text-right">Surface totale (m²)</TableHead>
                <TableHead className="text-right">Délai moyen (j)</TableHead>
                <TableHead className="text-center">Complétude docs</TableHead>
                <TableHead className="text-center">Ui moyen</TableHead>
                <TableHead className="text-right">Chiffre d'affaires</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamData.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.teamName}</TableCell>
                  <TableCell className="text-right">{team.projectsCompleted}</TableCell>
                  <TableCell className="text-right">{team.totalSurface.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{team.averageDelay}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompletenessColor(team.completeness)}`}>
                      {team.completeness}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm">
                      <div>{team.uiAverage.before} → {team.uiAverage.after}</div>
                      <div className="text-xs text-gray-500">
                        Δ: -{(team.uiAverage.before - team.uiAverage.after).toFixed(1)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(team.revenue)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancesTeamTable;
