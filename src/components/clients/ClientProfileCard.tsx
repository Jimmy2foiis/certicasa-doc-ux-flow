
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, User, CheckSquare, Building, Settings, Hash } from "lucide-react";
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
    <Card className="h-fit bg-white border-gray-200 shadow-sm">
      <CardHeader className="pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-500">Client Certicasa</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
              <Hash className="w-3 h-3 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">RES020</span>
            </div>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
              ACTIF
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium text-gray-900">Contact</Label>
          </div>
          <div className="space-y-3 ml-6">
            <div className="flex items-center gap-3">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-600">{client.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-600">{client.phone}</span>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium text-gray-900">Adresse</Label>
          </div>
          <div className="space-y-4 ml-6">
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Rue</p>
                  <p className="text-sm font-medium text-gray-900">Calle Alonso Castrillo 43</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Code postal</p>
                    <p className="text-sm font-medium text-gray-900">24200</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ville</p>
                    <p className="text-sm font-medium text-gray-900">Valencia de Don Juan</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Province</p>
                    <p className="text-sm font-medium text-gray-900">León</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Communauté</p>
                    <p className="text-sm font-medium text-gray-900">Castille-et-León</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Géolocalisation</p>
                    <p className="text-sm text-amber-600">À définir</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">UTM 30</p>
                    <p className="text-sm text-amber-600">À définir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Données techniques */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium text-gray-900">Données Techniques</Label>
          </div>
          <div className="space-y-4 ml-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">Type de plancher</Label>
                <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 focus:border-gray-300">
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

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">Zone climatique</Label>
                <Select value={localClimateZone} onValueChange={handleClimateZoneChange}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 focus:border-gray-300">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600">Surface combles (m²)</Label>
                  <Input
                    type="number"
                    value={localSurfaceArea}
                    onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                    className="h-10 bg-white border-gray-200 focus:border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600">Surface toiture (m²)</Label>
                  <Input
                    type="number"
                    value={localRoofArea}
                    onChange={(e) => handleRoofAreaChange(e.target.value)}
                    className="h-10 bg-white border-gray-200 focus:border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Équipe */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium text-gray-900">Équipe assignée</Label>
          </div>
          <div className="space-y-3 ml-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Téléprospecteur</p>
                <p className="text-sm font-medium text-gray-900">Amir</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Confirmateur</p>
                <p className="text-sm font-medium text-gray-900">Cynthia</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Équipe de pose</p>
                <p className="text-sm font-medium text-gray-900">RA BAT 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
          Modifier les informations
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
