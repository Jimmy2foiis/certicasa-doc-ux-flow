
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
  onEditClient?: (e: React.MouseEvent) => void;
}

const StatusBanner = ({ 
  client, 
  documentStats, 
  onViewMissingDocs = () => {},
  onEditClient = () => {}
}: StatusBannerProps) => {
  if (!client) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
      case 'en cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
          {client.status || 'En cours'}
        </Badge>
        
        <Badge variant="outline" className="px-3 py-1 bg-gray-800 text-white">
          RES020
        </Badge>
        
        <span className="text-sm text-gray-600">
          Date pose: {client.installationDate || '2025-04-21'}
        </span>
        
        <span className="text-sm text-gray-600">
          Numéro lot: {client.lotNumber || '-'}
        </span>
        
        <span className="text-sm text-gray-600">
          Date dépôt: {client.depositDate || '-'}
        </span>
        
        <span className="text-sm text-gray-600">
          Documents: {documentStats ? `${documentStats.generated}/${documentStats.total}` : '6/8'}
        </span>
        
        {/* Bouton voir documents manquants */}
        {hasMissingDocuments && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewMissingDocs}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir les documents manquants
          </Button>
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
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StatusBanner;
