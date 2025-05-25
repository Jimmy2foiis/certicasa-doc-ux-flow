import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, User, Eye } from "lucide-react";
interface StatusBannerProps {
  client?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    province?: string;
    community?: string;
  } | null;
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
  onViewMissingDocs,
  onEditClient
}: StatusBannerProps) => {
  return <div className="space-y-4">
      {/* Barre d'informations principale - maintenant dans la zone grise */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
        <div className="flex items-center gap-6">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            En cours
          </Badge>
          <span className="text-sm text-gray-600">
            Numéro lot: <span className="font-medium">-</span>
          </span>
          <span className="text-sm text-gray-600">
            Date dépôt: <span className="font-medium">-</span>
          </span>
          <span className="text-sm text-gray-600">
            Documents: <span className="font-medium">{documentStats ? `${documentStats.generated}/${documentStats.total}` : '5/8'}</span>
          </span>
        </div>
        
        {documentStats && documentStats.missing > 0 && <Button variant="outline" size="sm" onClick={onViewMissingDocs} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Voir les documents manquants
          </Button>}
      </div>

      {/* Bloc blanc avec les informations détaillées */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        {/* Section Contact */}
        

        {/* Section Adresse complète */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adresse complète
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="md:col-span-2 lg:col-span-1">
              <Input value={client?.address || ""} placeholder="Rue" className="text-sm h-8" readOnly />
            </div>
            <div>
              <Input value={client?.postalCode || ""} placeholder="Code postal" className="text-sm h-8" readOnly />
            </div>
            <div>
              <Input value={client?.city || ""} placeholder="Ville" className="text-sm h-8" readOnly />
            </div>
            <div>
              <Input value={client?.province || ""} placeholder="Province" className="text-sm h-8" readOnly />
            </div>
            <div className="md:col-span-2">
              <Input value={client?.community || ""} placeholder="Communauté autonome" className="text-sm h-8" readOnly />
            </div>
          </div>
        </div>

        {/* Barre avec badges */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Actif
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            RES020
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Équipe RA BAT 2
          </Badge>
        </div>
      </div>
    </div>;
};
export default StatusBanner;