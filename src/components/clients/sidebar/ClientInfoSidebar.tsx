
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, User, Settings } from "lucide-react";
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
  
  const [technicalExpanded, setTechnicalExpanded] = useState(false);

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
    <Card className="w-full shadow-sm">
      <CardContent className="p-3">
        {/* Section Client - Ultra compacte */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Client</span>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium truncate">{client.name}</div>
            <div className="text-xs text-gray-500 truncate">{client.address}</div>
            <div className="text-xs text-gray-500">{client.phone} • {client.email}</div>
          </div>
        </div>

        {/* Section Technique - Compacte avec toggle */}
        <div className="mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTechnicalExpanded(!technicalExpanded)}
            className="w-full justify-between p-1 h-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-3 w-3 text-gray-500" />
              <span>Technique</span>
            </div>
            {technicalExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
          
          {/* Résumé ultra compact */}
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
              {floorType}
            </Badge>
            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
              {climateZone}
            </Badge>
            <Badge variant="secondary" className="text-xs px-1 py-0 h-5">
              {surfaceArea}m²
            </Badge>
          </div>
          
          {technicalExpanded && (
            <div className="mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <Select value={floorType} onValueChange={handleFloorTypeChange}>
                  <SelectTrigger className="h-6 text-xs">
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
                
                <Select value={climateZone} onValueChange={handleClimateZoneChange}>
                  <SelectTrigger className="h-6 text-xs">
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
              
              <div className="grid grid-cols-2 gap-1">
                <Input
                  type="number"
                  value={surfaceArea}
                  onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                  placeholder="Combles"
                  className="h-6 text-xs"
                />
                <Input
                  type="number"
                  value={roofArea}
                  onChange={(e) => handleRoofAreaChange(e.target.value)}
                  placeholder="Toiture"
                  className="h-6 text-xs"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Équipe - Ultra compacte */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Équipe</span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">Amir</span> • <span className="font-medium">Cynthia</span> • <span className="font-medium">RA BAT 2</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSidebar;
