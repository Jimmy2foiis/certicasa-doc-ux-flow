
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, User, CheckSquare, Building } from "lucide-react";
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
    { value: "Béton", label: "🪨 Béton" },
    { value: "Bois", label: "🪵 Bois" },
    { value: "Céramique", label: "🧱 Céramique" }
  ];

  const climateZoneOptions = [
    { value: "A3", label: "A3" }, { value: "A4", label: "A4" },
    { value: "B3", label: "B3" }, { value: "B4", label: "B4" },
    { value: "C1", label: "C1" }, { value: "C2", label: "C2" },
    { value: "C3", label: "C3" }, { value: "C4", label: "C4" },
    { value: "D1", label: "D1" }, { value: "D2", label: "D2" },
    { value: "D3", label: "D3" }, { value: "E1", label: "E1" }
  ];

  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm">
      <CardContent className="p-6">
        {/* Nom du client et statut */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{client.name}</h2>
          <p className="text-gray-500 text-sm mb-3">Client Certicasa</p>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 mb-2">
            ACTIF
          </Badge>
        </div>

        {/* Code projet en carte verte */}
        <div className="mb-6">
          <Card className="bg-green-500 text-white">
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Code Projet</p>
              <p className="text-lg font-bold">RES020</p>
            </CardContent>
          </Card>
        </div>

        {/* Informations de contact */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="text-sm">{client.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="text-sm">{client.phone}</span>
          </div>
        </div>

        {/* Adresse complète structurée */}
        <div className="border-t pt-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Adresse complète
          </h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500">✅ Rue :</span>
                <p className="font-medium">Calle Alonso Castrillo 43</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">✅ Code postal :</span>
                <p className="font-medium">24200</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500">✅ Ville :</span>
                <p className="font-medium">Valencia de Don Juan</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">✅ Province :</span>
                <p className="font-medium">León</p>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">✅ Communauté autonome :</span>
              <p className="font-medium">Castille-et-León</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500">✅ Géolocalisation :</span>
                <p className="font-medium text-orange-600">À définir</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">✅ UTM 30 :</span>
                <p className="font-medium text-orange-600">À définir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Données techniques */}
        <div className="border-t pt-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Données Techniques</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type de plancher</label>
              <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                <SelectTrigger className="h-8 text-sm">
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
              <label className="text-xs text-gray-500 mb-1 block">Zone climatique</label>
              <Select value={localClimateZone} onValueChange={handleClimateZoneChange}>
                <SelectTrigger className="h-8 text-sm">
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Surface combles (m²)</label>
                <Input
                  type="number"
                  value={localSurfaceArea}
                  onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Surface toiture (m²)</label>
                <Input
                  type="number"
                  value={localRoofArea}
                  onChange={(e) => handleRoofAreaChange(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Équipe détaillée */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Équipe assignée</h3>
          <div className="space-y-2.5">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-500 mr-2.5" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Téléprospecteur</span>
                <span className="text-sm font-medium">Amir</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <CheckSquare className="h-4 w-4 text-gray-500 mr-2.5" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Confirmateur</span>
                <span className="text-sm font-medium">Cynthia</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Building className="h-4 w-4 text-gray-500 mr-2.5" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Équipe de pose</span>
                <span className="text-sm font-medium">RA BAT 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton d'action */}
        <Button className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white">
          Action
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
