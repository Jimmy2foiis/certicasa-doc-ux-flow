
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, Phone, MapPin, ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
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
    <Card className="w-full max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Nom du client */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{client.name}</h1>
            <p className="text-gray-500 text-sm mb-3">Client Certicasa</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-black text-white hover:bg-gray-800">
              RES020
            </Badge>
          </div>

          {/* Informations supplémentaires */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>Date pose: {client.installationDate || "À définir"}</p>
            <p>Numéro lot: {client.lotNumber || "Non assigné"}</p>
          </div>
        </div>

        {/* Section Contact */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
          <div className="space-y-2">
            <a href={`mailto:${client.email}`} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Mail className="h-4 w-4 mr-3" />
              <span className="text-sm">{client.email}</span>
            </a>
            <a href={`tel:${client.phone}`} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Phone className="h-4 w-4 mr-3" />
              <span className="text-sm">{client.phone}</span>
            </a>
          </div>
        </div>

        {/* Section Adresse */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <MapPin className="h-4 w-4 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Adresse complète</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div><span className="text-gray-500">Rue:</span> <span className="text-gray-900">{client.address || "Non renseignée"}</span></div>
            <div><span className="text-gray-500">Code postal:</span> <span className="text-gray-900">{client.postalCode || "Non renseigné"}</span></div>
            <div><span className="text-gray-500">Ville:</span> <span className="text-gray-900">Valencia de Don Juan</span></div>
            <div><span className="text-gray-500">Province:</span> <span className="text-gray-900">León</span></div>
            <div><span className="text-gray-500">Communauté autonome:</span> <span className="text-gray-900">{client.community || "Castille-et-León"}</span></div>
            <div><span className="text-gray-500">Géolocalisation:</span> <span className="text-gray-900 italic">À définir</span></div>
            <div><span className="text-gray-500">UTM:</span> <span className="text-gray-900 italic">À définir</span></div>
          </div>
        </div>

        {/* Section Données Techniques */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Données Techniques</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Type de plancher</label>
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
              <label className="block text-sm text-gray-500 mb-2">Zone climatique</label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface combles (m²)</label>
                <Input
                  type="number"
                  value={localSurfaceArea}
                  onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface toiture (m²)</label>
                <Input
                  type="number"
                  value={localRoofArea}
                  onChange={(e) => handleRoofAreaChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Équipe */}
        <Collapsible open={isTeamExpanded} onOpenChange={setIsTeamExpanded}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-gray-900">Équipe assignée</h3>
            {isTeamExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-white p-4 rounded-lg border space-y-2 text-sm">
              <div><span className="text-gray-500">Téléprospecteur:</span> <span className="text-gray-900 font-medium">{client.teleprospector || "Amir"}</span></div>
              <div><span className="text-gray-500">Confirmateur:</span> <span className="text-gray-900 font-medium">{client.confirmer || "Cynthia"}</span></div>
              <div><span className="text-gray-500">Équipe de pose:</span> <span className="text-gray-900 font-medium">{client.installationTeam || "RA BAT 2"}</span></div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Footer */}
        <div className="pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2">
                Action
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem>Modifier les informations</DropdownMenuItem>
              <DropdownMenuItem>Programmer une visite</DropdownMenuItem>
              <DropdownMenuItem>Générer un devis</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Supprimer le client</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
