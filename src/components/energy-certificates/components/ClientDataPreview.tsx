
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Mail, Phone, FileText, Zap, Euro } from "lucide-react";

interface ClientDataPreviewProps {
  client: any;
}

const ClientDataPreview = ({ client }: ClientDataPreviewProps) => {
  // Données simulées pour l'aperçu
  const thermalData = {
    surface: Math.floor(Math.random() * 50) + 50,
    cae: -(Math.floor(Math.random() * 500) + 800),
    price: -(Math.floor(Math.random() * 100) + 80),
    climateZone: 'C3',
    thermalCoefficient: 46
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informations personnelles */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Informations Client</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="font-medium">{client.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-sm">{client.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{client.address}</span>
            </div>
            {client.nif && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm">NIF: {client.nif}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Données thermiques */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Économie Thermique</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Surface habitable</span>
              <Badge variant="secondary">{thermalData.surface} m²</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Zone thermique</span>
              <Badge variant="secondary">{thermalData.climateZone} - Coefficient {thermalData.thermalCoefficient}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CAE projet</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {thermalData.cae} kWh/an
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Prix projet</span>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Euro className="h-3 w-3 mr-1" />
                {thermalData.price} €
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Prix au m²</span>
              <Badge variant="secondary">
                {(thermalData.price / thermalData.surface).toFixed(2)} €/m²
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDataPreview;
