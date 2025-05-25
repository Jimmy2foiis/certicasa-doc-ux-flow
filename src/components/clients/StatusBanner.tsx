
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, AlertCircle, Edit, Eye } from "lucide-react";
import { Client } from "@/services/api/types";

interface StatusBannerProps {
  client: Client | null;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
  onGenerateDocument?: () => void;
  onEditClient?: (e: React.MouseEvent) => void;
}

const StatusBanner = ({ 
  client, 
  documentStats, 
  onViewMissingDocs = () => {},
  onGenerateDocument = () => {},
  onEditClient = () => {}
}: StatusBannerProps) => {
  if (!client) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
      case 'inactif':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const hasMissingDocuments = documentStats && documentStats.missing > 0;

  return (
    <div className="space-y-3">
      {/* Statut principal du client */}
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className={`px-3 py-1 ${getStatusColor(client.status || 'En cours')}`}
        >
          Statut: {client.status || 'En cours'}
        </Badge>
        
        {client.delegate && (
          <Badge variant="outline" className="px-3 py-1">
            Délégué: {client.delegate}
          </Badge>
        )}
        
        {client.lotNumber && (
          <Badge variant="outline" className="px-3 py-1">
            Lot: {client.lotNumber}
          </Badge>
        )}
        
        {/* Bouton d'édition */}
        <Button
          variant="outline"
          size="sm"
          onClick={onEditClient}
          className="ml-auto"
        >
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
      </div>

      {/* Alerte pour documents manquants */}
      {hasMissingDocuments && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-800">
              {documentStats.missing} document(s) manquant(s) pour finaliser le dossier
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewMissingDocs}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir les documents manquants
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques des documents */}
      {documentStats && (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Documents: {documentStats.total} total</span>
          <span className="text-green-600">{documentStats.generated} générés</span>
          {documentStats.missing > 0 && (
            <span className="text-orange-600">{documentStats.missing} manquants</span>
          )}
          {documentStats.error > 0 && (
            <span className="text-red-600">{documentStats.error} en erreur</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusBanner;
