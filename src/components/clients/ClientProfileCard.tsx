
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, Phone, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { Client } from "@/services/api/types";

interface ClientProfileCardProps {
  client: Client | null;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  climateZone?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ClientProfileCard = ({ 
  client,
  surfaceArea = "56",
  roofArea = "89",
  floorType = "Bois",
  climateZone = "C3",
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ClientProfileCardProps) => {
  const [localSurfaceArea, setLocalSurfaceArea] = useState(surfaceArea);
  const [localRoofArea, setLocalRoofArea] = useState(roofArea);
  const [localFloorType, setLocalFloorType] = useState(floorType);
  const [localClimateZone, setLocalClimateZone] = useState(climateZone);
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);

  const handleSurfaceAreaChange = (value: string) => {
    setLocalSurfaceArea(value);
    if (onSurfaceAreaChange) {
      onSurfaceAreaChange(value);
    }
  };

  const handleRoofAreaChange = (value: string) => {
    setLocalRoofArea(value);
    if (onRoofAreaChange) {
      onRoofAreaChange(value);
    }
  };

  const handleFloorTypeChange = (value: string) => {
    setLocalFloorType(value);
    if (onFloorTypeChange) {
      onFloorTypeChange(value);
    }
  };

  const handleClimateZoneChange = (value: string) => {
    setLocalClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };

  if (!client) return null;

  const floorTypeOptions = [
    { value: "Bois", label: "🪵 Bois" },
    { value: "Béton", label: "🪨 Béton" },
    { value: "Métal", label: "⚙️ Métal" },
    { value: "Autre", label: "📦 Autre" }
  ];

  const climateZoneOptions = [
    { value: "A3", label: "A3" },
    { value: "B3", label: "B3" },
    { value: "C3", label: "C3" },
    { value: "D3", label: "D3" },
    { value: "E1", label: "E1" }
  ];

  // Parse address for structured display
  const addressParts = client.address ? client.address.split(',').map(part => part.trim()) : [];
  const street = addressParts[0] || "À définir";
  const postalCode = "À définir";
  const city = addressParts[1] || "À définir";
  const province = "À définir";
  const community = "À définir";
  const geoLocation = "À définir";
  const utmZone = "À définir";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Logo circulaire */}
            <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">RES020</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-500">Client Certicasa</p>
              <div className="lg:hidden">
                <Badge className="bg-[#4CAF50] text-white border-[#4CAF50]">
                  ACTIVE
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <Badge className="bg-[#4CAF50] text-white border-[#4CAF50]">
              ACTIVE
            </Badge>
          </div>
        </div>
      </div>

      {/* Layout responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche */}
        <div className="space-y-6">
          {/* Section Contact */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Contact</h2>
              <div className="space-y-3">
                <a 
                  href={`mailto:${client.email}`} 
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>{client.email}</span>
                </a>
                <a 
                  href={`tel:${client.phone}`} 
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>{client.phone}</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Section Adresse */}
          <Card className="shadow-sm bg-[#f5f5f5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Adresse complète</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Rue</label>
                  <p className="text-gray-900">{street}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Code postal</label>
                  <p className="text-gray-900">{postalCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ville</label>
                  <p className="text-gray-900">{city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Province</label>
                  <p className="text-gray-900">{province}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Communauté autonome</label>
                  <p className="text-gray-900">{community}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Géolocalisation</label>
                  <p className="text-gray-500 italic">{geoLocation}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-600">UTM</label>
                  <p className="text-gray-500 italic">{utmZone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Équipe */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <Collapsible open={isTeamExpanded} onOpenChange={setIsTeamExpanded}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-semibold">Équipe assignée</h2>
                  {isTeamExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Téléprospecteur</label>
                    <p className="text-gray-900">Amir</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Confirmateur</label>
                    <p className="text-gray-900">Cynthia</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Équipe de pose</label>
                    <p className="text-gray-900">RA BAT 2</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite */}
        <div>
          {/* Section Données Techniques */}
          <Card className="shadow-sm h-fit">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">Données Techniques</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Type de plancher
                  </label>
                  <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {floorTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Zone climatique
                  </label>
                  <Select value={localClimateZone} onValueChange={handleClimateZoneChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {climateZoneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Surface combles (m²)
                    </label>
                    <Input
                      type="number"
                      value={localSurfaceArea}
                      onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                      className="w-full"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Surface toiture (m²)
                    </label>
                    <Input
                      type="number"
                      value={localRoofArea}
                      onChange={(e) => handleRoofAreaChange(e.target.value)}
                      className="w-full"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="lg:flex lg:justify-end">
        <Button 
          className="w-full lg:w-auto bg-black hover:bg-gray-800 text-white px-8 py-3"
          size="lg"
        >
          Action
        </Button>
      </div>
    </div>
  );
};

export default ClientProfileCard;
