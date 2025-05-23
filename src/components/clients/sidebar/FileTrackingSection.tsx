
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FileTrackingSectionProps {
  status: string;
  delegate: string;
  lotNumber: string;
  depositDate?: string;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
}

const FileTrackingSection = ({
  status,
  delegate,
  lotNumber,
  depositDate,
  documentStats,
  onViewMissingDocs,
}: FileTrackingSectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "à déposer":
        return "bg-amber-100 text-amber-800";
      case "déposé":
        return "bg-indigo-100 text-indigo-800";
      case "validé":
        return "bg-green-100 text-green-800";
      case "rejeté":
      case "blocage":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isLotNumber = lotNumber !== "-" && lotNumber.trim() !== "";
  const hasMissingDocuments = documentStats && documentStats.generated < documentStats.total;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-base border-b pb-1">Suivi du dossier administratif</h3>
      
      <div className="space-y-2.5">
        {/* Status */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Statut du dossier</span>
          <Badge className={cn("mt-1 w-fit", getStatusColor(status))}>
            {status}
          </Badge>
        </div>
        
        {/* Delegate */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Délégataire</span>
          <span className="font-medium">{delegate}</span>
        </div>
        
        {/* Lot Number */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Numéro de lot</span>
          {isLotNumber ? (
            <Link to={`/lots/${lotNumber}`} className="font-medium text-primary flex items-center hover:underline">
              {lotNumber}
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          ) : (
            <span className="font-medium">{lotNumber}</span>
          )}
        </div>
        
        {/* Deposit Date */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Date de dépôt</span>
          <span className="font-medium">{depositDate || "-"}</span>
        </div>
        
        {/* Documents Generated */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Documents générés</span>
          <span className="font-medium">
            {documentStats ? `${documentStats.generated} / ${documentStats.total} documents générés` : "- / - documents générés"}
          </span>
        </div>
        
        {/* Missing Documents Button */}
        {hasMissingDocuments && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewMissingDocs}
            className="w-full mt-2"
          >
            <Folder className="mr-2 h-4 w-4" />
            Voir les documents manquants
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileTrackingSection;
