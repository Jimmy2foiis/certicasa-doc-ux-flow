
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dossier } from "./AdminDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface DossiersTableProps {
  dossiers: Dossier[];
}

const DossiersTable = ({ dossiers }: DossiersTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Status badge variants
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">En attente</Badge>;
      case "termine":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Terminé</Badge>;
      case "rejete":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejeté</Badge>;
      case "validation":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">En attente de validation</Badge>;
      case "annule":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Handle copy drive link
  const handleCopyDriveLink = (driveLink: string) => {
    navigator.clipboard.writeText(driveLink);
    toast({
      title: "Lien Drive copié !",
      description: "Le lien a été copié dans le presse-papiers.",
      duration: 3000,
    });
  };

  // Handle view dossier details
  const handleViewDossier = (dossierId: string) => {
    navigate(`/admin/dossier/${dossierId}`);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Lien Drive</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dossiers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
                <p className="text-gray-500">Aucun dossier trouvé</p>
                <p className="text-sm text-gray-400 mt-1">
                  Modifiez vos critères de recherche ou de filtre
                </p>
              </TableCell>
            </TableRow>
          ) : (
            dossiers.map((dossier) => (
              <TableRow key={dossier.id}>
                <TableCell className="font-medium">
                  <div>{dossier.clientName}</div>
                  <div className="text-xs text-gray-500">{dossier.clientId}</div>
                </TableCell>
                <TableCell>
                  <div>{dossier.contactPhone}</div>
                  <div className="text-xs text-gray-500">{dossier.contactEmail}</div>
                </TableCell>
                <TableCell>{dossier.responsiblePerson}</TableCell>
                <TableCell>{dossier.date}</TableCell>
                <TableCell>{getStatusBadge(dossier.status)}</TableCell>
                <TableCell>{dossier.duration}</TableCell>
                <TableCell>{dossier.documentsCount}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      {dossier.driveLink}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1"
                      onClick={() => handleCopyDriveLink(dossier.driveLink)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleViewDossier(dossier.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span>Voir</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DossiersTable;
