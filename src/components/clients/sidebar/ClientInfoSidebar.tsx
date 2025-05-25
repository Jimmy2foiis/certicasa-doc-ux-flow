
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Synchroniser avec les props externes
  useEffect(() => {
    if (currentClimateZone && currentClimateZone !== climateZone) {
      setClimateZone(currentClimateZone);
    }
  }, [currentClimateZone]);

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
    console.log("🌡️ Zone climatique changée dans sidebar:", value);
    setClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
      console.log("🚀 Propagation vers parent:", value);
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
      <CardContent className="p-3">
        <div className="grid grid-cols-3 gap-6">
          {/* Colonne 1: Informations du client */}
          <div>
            <ClientPersonalSection client={client} />
          </div>
          
          {/* Colonne 2: Informations techniques */}
          <div>
            <div className="space-y-3">
              <h3 className="font-semibold text-base border-b pb-1">Informations techniques</h3>
              
              <div className="space-y-2.5">
                {/* Type d'isolation */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Type d'isolation</span>
                  <span className="font-medium">{client.isolationType || "Combles"}</span>
                </div>
                
                {/* Type de plancher */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Type de plancher</span>
                  <Select value={floorType} onValueChange={handleFloorTypeChange}>
                    <SelectTrigger className="mt-1">
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
                
                {/* Zone climatique - 🎯 Source de vérité */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Zone climatique</span>
                  <Select value={climateZone} onValueChange={handleClimateZoneChange}>
                    <SelectTrigger className="mt-1">
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
                
                {/* Superficie des combles */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Superficie des combles (m²)</span>
                  <Input
                    type="number"
                    value={surfaceArea}
                    onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                {/* Superficie de la toiture */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Superficie de la toiture (m²)</span>
                  <Input
                    type="number"
                    value={roofArea}
                    onChange={(e) => handleRoofAreaChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Colonne 3: Équipe projet */}
          <div>
            <ProjectTeamSection 
              teleprospector="Amir"
              confirmer="Cynthia"
              installationTeam="RA BAT 2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSidebar;
