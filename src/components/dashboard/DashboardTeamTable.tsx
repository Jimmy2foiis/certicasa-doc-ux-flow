
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, FileText } from "lucide-react";

interface DashboardTeamTableProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const DashboardTeamTable: React.FC<DashboardTeamTableProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
}) => {
  // Données mockées pour le tableau des équipes
  const teamData = [
    {
      id: "artisol",
      name: "ARTISOL",
      projetsTermines: 37,
      surfacePosee: 2340,
      delaiMoyen: 6.2,
      tauxDocuments: 89,
      uiAvant: 2.1,
      uiApres: 0.9,
    },
    {
      id: "renovation-plus",
      name: "Rénovation Plus",
      projetsTermines: 28,
      surfacePosee: 1890,
      delaiMoyen: 7.1,
      tauxDocuments: 92,
      uiAvant: 2.3,
      uiApres: 0.85,
    },
    {
      id: "eco-habitat",
      name: "Éco Habitat",
      projetsTermines: 31,
      surfacePosee: 2150,
      delaiMoyen: 5.8,
      tauxDocuments: 85,
      uiAvant: 2.0,
      uiApres: 0.95,
    },
    {
      id: "thermique-pro",
      name: "Thermique Pro",
      projetsTermines: 24,
      surfacePosee: 1650,
      delaiMoyen: 8.2,
      tauxDocuments: 78,
      uiAvant: 2.4,
      uiApres: 1.0,
    },
  ];

  const handleViewDetails = (teamId: string) => {
    console.log(`Voir détails équipe ${teamId}`);
  };

  const handleExportTeam = (teamId: string) => {
    console.log(`Export équipe ${teamId}`);
  };

  const handleFollowLot = (teamId: string) => {
    console.log(`Suivre lot équipe ${teamId}`);
  };

  const getCompletionBadge = (rate: number) => {
    if (rate >= 90) return <Badge className="bg-green-100 text-green-800">{rate}%</Badge>;
    if (rate >= 80) return <Badge className="bg-yellow-100 text-yellow-800">{rate}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">{rate}%</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Performance par équipe</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Équipe de pose</TableHead>
              <TableHead className="text-center">Projets terminés</TableHead>
              <TableHead className="text-center">Surface posée</TableHead>
              <TableHead className="text-center">Délai moyen</TableHead>
              <TableHead className="text-center">Taux documents</TableHead>
              <TableHead className="text-center">Ui avant → après</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamData.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell className="text-center">{team.projetsTermines}</TableCell>
                <TableCell className="text-center">{team.surfacePosee.toLocaleString()} m²</TableCell>
                <TableCell className="text-center">{team.delaiMoyen} jours</TableCell>
                <TableCell className="text-center">
                  {getCompletionBadge(team.tauxDocuments)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm">
                    {team.uiAvant} → {team.uiApres}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(team.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleExportTeam(team.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFollowLot(team.id)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DashboardTeamTable;
