
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, User, CheckSquare, Building, Settings } from "lucide-react";
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
    <Card className="h-fit border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{client.name}</h3>
            <p className="text-sm text-muted-foreground">Client Certicasa</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            ACTIF
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Code projet */}
        <Card className="bg-primary border-primary">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-medium text-primary-foreground/80">Code Projet</p>
            <p className="text-xl font-bold text-primary-foreground">RES020</p>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact
          </h4>
          <div className="space-y-2 pl-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adresse complète
          </h4>
          <div className="space-y-3 pl-6">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-primary">✅</span>
                <div>
                  <span className="text-xs text-muted-foreground">Rue :</span>
                  <p className="text-sm font-medium text-foreground">Calle Alonso Castrillo 43</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-primary">✅</span>
                  <div>
                    <span className="text-xs text-muted-foreground">Code postal :</span>
                    <p className="text-sm font-medium text-foreground">24200</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-primary">✅</span>
                  <div>
                    <span className="text-xs text-muted-foreground">Ville :</span>
                    <p className="text-sm font-medium text-foreground">Valencia de Don Juan</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-primary">✅</span>
                  <div>
                    <span className="text-xs text-muted-foreground">Province :</span>
                    <p className="text-sm font-medium text-foreground">León</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-primary">✅</span>
                  <div>
                    <span className="text-xs text-muted-foreground">Communauté :</span>
                    <p className="text-sm font-medium text-foreground">Castille-et-León</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-orange-500">⏳</span>
                  <div>
                    <span className="text-xs text-muted-foreground">Géolocalisation :</span>
                    <p className="text-sm text-orange-600">À définir</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-orange-500">⏳</span>
                  <div>
                    <span className="text-xs text-muted-foreground">UTM 30 :</span>
                    <p className="text-sm text-orange-600">À définir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Données techniques */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Données Techniques
          </h4>
          <div className="space-y-3 pl-6">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Type de plancher</label>
                <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                  <SelectTrigger className="h-9 text-sm border-input">
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

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Zone climatique</label>
                <Select value={localClimateZone} onValueChange={handleClimateZoneChange}>
                  <SelectTrigger className="h-9 text-sm border-input">
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
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Surface combles (m²)</label>
                  <Input
                    type="number"
                    value={localSurfaceArea}
                    onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                    className="h-9 text-sm border-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Surface toiture (m²)</label>
                  <Input
                    type="number"
                    value={localRoofArea}
                    onChange={(e) => handleRoofAreaChange(e.target.value)}
                    className="h-9 text-sm border-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Équipe */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Équipe assignée
          </h4>
          <div className="space-y-2 pl-6">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-xs text-muted-foreground">Téléprospecteur</span>
                <p className="text-sm font-medium text-foreground">Amir</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-xs text-muted-foreground">Confirmateur</span>
                <p className="text-sm font-medium text-foreground">Cynthia</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-xs text-muted-foreground">Équipe de pose</span>
                <p className="text-sm font-medium text-foreground">RA BAT 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button className="w-full" variant="outline">
          Modifier les informations
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
