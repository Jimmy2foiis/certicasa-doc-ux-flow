
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, User, Eye, CheckSquare, Building } from "lucide-react";
import AddressSearch from "@/components/clients/AddressSearch";

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
  const [addressData, setAddressData] = useState({
    street: client?.address || "",
    postalCode: client?.postalCode || "",
    city: client?.city || "",
    province: client?.province || "",
    community: client?.community || "",
    utm: "",
    coordinates: ""
  });

  const handleAddressSelected = (selectedAddress: string) => {
    // Parse the selected address and update all fields
    setAddressData(prev => ({
      ...prev,
      street: selectedAddress
    }));
  };

  const handleCoordinatesSelected = (coords: { lat: number; lng: number }) => {
    setAddressData(prev => ({
      ...prev,
      coordinates: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return <div className="space-y-4">
      {/* Barre d'informations principale - maintenant dans la zone grise */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
        <div className="flex items-center gap-6">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            RES020
          </Badge>
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
        {/* Section Adresse complète restructurée */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adresse complète
          </h3>
          
          {/* Ligne 1: Rue, Code postal, Ville */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <AddressSearch
                initialAddress={addressData.street}
                onAddressChange={(address) => handleInputChange('street', address)}
                onCoordinatesChange={handleCoordinatesSelected}
              />
            </div>
            <div>
              <Input 
                value={addressData.postalCode} 
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Code postal" 
                className="text-sm h-8" 
              />
            </div>
            <div>
              <Input 
                value={addressData.city} 
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Ville" 
                className="text-sm h-8" 
              />
            </div>
          </div>

          {/* Ligne 2: Province, Communauté autonome, UTM */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <Input 
                value={addressData.province} 
                onChange={(e) => handleInputChange('province', e.target.value)}
                placeholder="Province" 
                className="text-sm h-8" 
              />
            </div>
            <div>
              <Input 
                value={addressData.community} 
                onChange={(e) => handleInputChange('community', e.target.value)}
                placeholder="Communauté autonome" 
                className="text-sm h-8" 
              />
            </div>
            <div>
              <Input 
                value={addressData.utm} 
                onChange={(e) => handleInputChange('utm', e.target.value)}
                placeholder="UTM" 
                className="text-sm h-8" 
              />
            </div>
          </div>

          {/* Ligne 3: Géolocalisation, deux cellules vides */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Input 
                value={addressData.coordinates} 
                onChange={(e) => handleInputChange('coordinates', e.target.value)}
                placeholder="Géolocalisation (lat, lng)" 
                className="text-sm h-8" 
              />
            </div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* Badges équipe avec icônes */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5 px-3 py-1">
            <User className="h-3 w-3" />
            Téléprospecteur : Amir
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 px-3 py-1">
            <CheckSquare className="h-3 w-3" />
            Confirmateur : Cynthia
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1.5 px-3 py-1">
            <Building className="h-3 w-3" />
            Équipe de pose : RA BAT 2
          </Badge>
        </div>
      </div>
    </div>;
};

export default StatusBanner;
