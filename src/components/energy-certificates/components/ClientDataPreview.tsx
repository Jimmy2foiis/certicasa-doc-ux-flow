
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Phone, Mail, FileText, Building, Zap } from "lucide-react";

interface ClientDataPreviewProps {
  client: any;
}

const ClientDataPreview = ({ client }: ClientDataPreviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Informations Personnelles
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Nom</label>
              <p className="font-medium">{client.name}</p>
            </div>
            {client.email && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                <p className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  {client.email}
                </p>
              </div>
            )}
            {client.phone && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Téléphone</label>
                <p className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-gray-400" />
                  {client.phone}
                </p>
              </div>
            )}
            {client.nif && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">NIF</label>
                <p className="font-mono text-sm">{client.nif}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adresse
          </h4>
          <div className="space-y-2">
            {client.address && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Adresse complète</label>
                <p>{client.address}</p>
              </div>
            )}
            <div className="pt-2">
              <Badge variant="outline" className="text-xs">
                Zone climatique: D3
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Projet
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Type</label>
              <p className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-gray-400" />
                {client.type || "Résidentiel"}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Statut</label>
              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                {client.status || "En cours"}
              </Badge>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Projets</label>
              <p className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-gray-400" />
                {client.projects || 0} projet(s)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDataPreview;
