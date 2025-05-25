
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, User, CheckSquare, Building, Hash, ChevronRight } from "lucide-react";
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
    <Card className="w-full max-w-sm mx-auto bg-white border-0 shadow-lg">
      <CardContent className="p-8">
        {/* Header avec avatar et nom */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{client.name}</h2>
          <p className="text-gray-500 mb-4">Client Certicasa</p>
          
          {/* RES020 Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            <Hash className="w-3 h-3" />
            <span>RES020</span>
          </div>
          
          {/* Status */}
          <div className="mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
              ACTIVE
            </Badge>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{client.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{client.phone}</span>
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Département</h3>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">León</p>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Bureau</h3>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Valencia de Don Juan</p>
        </div>

        {/* Technical Data */}
        <div className="space-y-6 mb-8">
          <div>
            <Label className="text-sm font-medium text-gray-600 mb-2 block">Type de plancher</Label>
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
            <Label className="text-sm font-medium text-gray-600 mb-2 block">Zone climatique</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600 mb-2 block">Surface combles (m²)</Label>
              <Input
                type="number"
                value={localSurfaceArea}
                onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 mb-2 block">Surface toiture (m²)</Label>
              <Input
                type="number"
                value={localRoofArea}
                onChange={(e) => handleRoofAreaChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Line Manager */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Responsable d'équipe</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Cynthia Martinez</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg">
          Action
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
