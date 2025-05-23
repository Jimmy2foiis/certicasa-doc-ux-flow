
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Edit, User, CheckSquare, Building, Folder } from "lucide-react";
import { getStatusColor } from "./table/utils/statusUtils";
import { Client } from "@/services/api/types";

interface StatusBannerProps {
  client: Client | null;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs: () => void;
  onGenerateDocument?: () => void;
  onEditClient?: () => void;
}

const StatusBanner = ({
  client,
  documentStats,
  onViewMissingDocs,
  onGenerateDocument = () => {},
  onEditClient = () => {},
}: StatusBannerProps) => {
  if (!client) return null;

  const isLotNumber = client.lotNumber && client.lotNumber !== "-" && client.lotNumber.trim() !== "";
  const hasMissingDocuments = documentStats && documentStats.generated < documentStats.total;
  
  return (
    <div className="w-full bg-slate-50 rounded-lg p-3 mb-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Status Badge */}
          <div className="flex items-center">
            <Badge className={`${getStatusColor(client.status || "En cours")}`}>
              {client.status || "En cours"}
            </Badge>
          </div>
          
          {/* Type de fiche */}
          <div>
            <Badge variant="secondary" className="mr-1">
              {client.ficheType || "RES020"}
            </Badge>
          </div>
          
          {/* Lot number - cliquable */}
          <div>
            {isLotNumber ? (
              <Link to={`/lots/${client.lotNumber}`} className="text-sm text-primary flex items-center hover:underline">
                Lot: <span className="font-semibold ml-1">{client.lotNumber}</span>
              </Link>
            ) : (
              <span className="text-sm text-gray-500">Lot: <span className="font-semibold text-gray-700">-</span></span>
            )}
          </div>
          
          {/* Délégataire */}
          <div>
            <span className="text-xs text-gray-500">Délégataire:</span> 
            <span className="text-sm font-medium ml-1">{client.delegate || "SOLATEC"}</span>
          </div>
          
          {/* Date de pose */}
          <div>
            <span className="text-xs text-gray-500">Date pose:</span>
            <span className="text-sm font-medium ml-1">{client.installationDate || "-"}</span>
          </div>
          
          {/* Équipe projet */}
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 text-gray-500 mr-1" />
            <span className="text-sm">{client.teleprospector || "-"}</span>
            <span className="mx-1 text-gray-300">/</span>
            <CheckSquare className="h-3.5 w-3.5 text-gray-500 mr-1" />
            <span className="text-sm">{client.confirmer || "-"}</span>
            <span className="mx-1 text-gray-300">/</span>
            <Building className="h-3.5 w-3.5 text-gray-500 mr-1" />
            <span className="text-sm">{client.installationTeam || "-"}</span>
          </div>
          
          {/* Documents générés */}
          <div className="flex items-center">
            <span className="text-xs text-gray-500">Documents:</span>
            <span className="text-sm font-medium ml-1">
              {documentStats ? `${documentStats.generated}/${documentStats.total}` : "0/8"}
            </span>
          </div>
          
          {/* Bouton documents manquants */}
          {hasMissingDocuments && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewMissingDocs}
              className="text-xs"
            >
              <Folder className="mr-1 h-3.5 w-3.5" />
              Voir les documents manquants
            </Button>
          )}
        </div>
        
        {/* Boutons d'action à droite */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateDocument}
          >
            <FileText className="mr-1 h-4 w-4" />
            Générer un document
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClient}
          >
            <Edit className="mr-1 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
