
import React, { useState } from "react";
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
}

const ClientInfoSidebar = ({ 
  client, 
  documentStats, 
  onViewMissingDocs,
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange
}: ClientInfoSidebarProps) => {
  const [surfaceArea, setSurfaceArea] = useState("56");
  const [roofArea, setRoofArea] = useState("89");
  const [floorType, setFloorType] = useState(client?.floorType || "Bois");

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

  if (!client) return null;

  const floorTypeOptions = [
    { value: "Béton", label: "🪨 Béton (Hormigón)" },
    { value: "Bois", label: "🪵 Bois (Madera)" },
    { value: "Céramique", label: "🧱 Céramique (Cerámico/Bovedilla)" }
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
                
                {/* Zone climatique */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Zone climatique</span>
                  <Badge variant="outline" className="mt-1 w-fit">
                    {client.climateZone || "C"}
                  </Badge>
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
