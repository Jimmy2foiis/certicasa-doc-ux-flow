
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import ClientPersonalSection from "./ClientPersonalSection";
import ProjectTeamSection from "./ProjectTeamSection";
import { Client } from "@/services/api/types";

interface ClientInfoSidebarProps {
  client: Client | null;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
  currentSurfaceArea?: string;
  currentRoofArea?: string;
  currentFloorType?: string;
  currentClimateZone?: string;
}

const ClientInfoSidebar = ({ 
  client, 
  documentStats, 
  onViewMissingDocs,
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange,
  currentSurfaceArea = "56",
  currentRoofArea = "89",
  currentFloorType,
  currentClimateZone
}: ClientInfoSidebarProps) => {
  const [surfaceArea, setSurfaceArea] = useState(currentSurfaceArea);
  const [roofArea, setRoofArea] = useState(currentRoofArea);
  const [floorType, setFloorType] = useState(currentFloorType || client?.floorType || "Bois");
  const [climateZone, setClimateZone] = useState(currentClimateZone || client?.climateZone || "C3");
  
  // États pour les sections collapsibles
  const [technicalExpanded, setTechnicalExpanded] = useState(true);
  const [teamExpanded, setTeamExpanded] = useState(false);

  const handleSurfaceAreaChange = (value: string) => {
    setSurfaceArea(value);
    if (onSurfaceAreaChange) {
      onSurfaceAreaChange(value);
    }
  };

  const handleRoofAreaChange = (value: string) => {
    setRoofArea(value);
    if (onRoofAreaChange) {
      onRoofAreaChange(value);
    }
  };

  const handleFloorTypeChange = (value: string) => {
    setFloorType(value);
    if (onFloorTypeChange) {
      onFloorTypeChange(value);
    }
  };

  const handleClimateZoneChange = (value: string) => {
    setClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };

  if (!client) return null;

  const floorTypeOptions = [
    { value: "Béton", label: "🪨 Béton (Hormigón)" },
    { value: "Bois", label: "🪵 Bois (Madera)" },
    { value: "Céramique", label: "🧱 Céramique (Cerámico/Bovedilla)" }
  ];

  const climateZoneOptions = [
    { value: "A3", label: "A3" },
    { value: "A4", label: "A4" },
    { value: "B3", label: "B3" },
    { value: "B4", label: "B4" },
    { value: "C1", label: "C1" },
    { value: "C2", label: "C2" },
    { value: "C3", label: "C3" },
    { value: "C4", label: "C4" },
    { value: "D1", label: "D1" },
    { value: "D2", label: "D2" },
    { value: "D3", label: "D3" },
    { value: "E1", label: "E1" }
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4">
        {/* Informations du client - Toujours visible */}
        <div className="mb-4">
          <ClientPersonalSection client={client} />
        </div>
        
        {/* Version compacte des informations techniques */}
        <div className="mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTechnicalExpanded(!technicalExpanded)}
            className="w-full justify-between p-2 h-auto font-semibold text-sm"
          >
            <span>Informations techniques</span>
            {technicalExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          
          {/* Résumé compact visible en permanence */}
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {client.isolationType || "Combles"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {floorType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {climateZone}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {surfaceArea}m² / {roofArea}m²
            </Badge>
          </div>
          
          {technicalExpanded && (
            <div className="mt-3 space-y-3">
              {/* Type de plancher */}
              <div className="grid grid-cols-2 gap-2 items-center">
                <span className="text-xs text-gray-500">Type de plancher</span>
                <Select value={floorType} onValueChange={handleFloorTypeChange}>
                  <SelectTrigger className="h-8 text-xs">
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
              
              {/* Zone climatique */}
              <div className="grid grid-cols-2 gap-2 items-center">
                <span className="text-xs text-gray-500">Zone climatique</span>
                <Select value={climateZone} onValueChange={handleClimateZoneChange}>
                  <SelectTrigger className="h-8 text-xs">
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
              
              {/* Superficies */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Combles (m²)</span>
                  <Input
                    type="number"
                    value={surfaceArea}
                    onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Toiture (m²)</span>
                  <Input
                    type="number"
                    value={roofArea}
                    onChange={(e) => handleRoofAreaChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Version compacte de l'équipe projet */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTeamExpanded(!teamExpanded)}
            className="w-full justify-between p-2 h-auto font-semibold text-sm"
          >
            <span>Équipe projet</span>
            {teamExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          
          {/* Résumé compact visible en permanence */}
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Amir</span> • <span className="font-medium">Cynthia</span> • <span className="font-medium">RA BAT 2</span>
          </div>
          
          {teamExpanded && (
            <div className="mt-3">
              <ProjectTeamSection 
                teleprospector="Amir"
                confirmer="Cynthia"
                installationTeam="RA BAT 2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSidebar;
