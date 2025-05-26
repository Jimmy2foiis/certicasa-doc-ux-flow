
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectInfoSectionProps {
  isolationType?: string;
  floorType?: string;
  climateZone?: string;
  surfaceArea: string;
  roofArea: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ProjectInfoSection = ({
  isolationType = "Combles",
  floorType = "Bois",
  climateZone = "C3",
  surfaceArea,
  roofArea,
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ProjectInfoSectionProps) => {
  const [localSurfaceArea, setLocalSurfaceArea] = useState(surfaceArea);
  const [localRoofArea, setLocalRoofArea] = useState(roofArea);
  const [localFloorType, setLocalFloorType] = useState(floorType);
  const [localClimateZone, setLocalClimateZone] = useState(climateZone);

  // Synchroniser avec les props
  useEffect(() => {
    setLocalSurfaceArea(surfaceArea);
  }, [surfaceArea]);

  useEffect(() => {
    setLocalRoofArea(roofArea);
  }, [roofArea]);

  useEffect(() => {
    setLocalFloorType(floorType);
  }, [floorType]);

  useEffect(() => {
    console.log('🌡️ ProjectInfoSection - Zone climatique reçue:', climateZone);
    setLocalClimateZone(climateZone);
  }, [climateZone]);

  const handleSurfaceAreaChange = (value: string) => {
    console.log('📊 ProjectInfoSection - Surface combles changée:', value, '-> Propagation immédiate');
    setLocalSurfaceArea(value);
    if (onSurfaceAreaChange) {
      onSurfaceAreaChange(value);
    }
  };

  const handleRoofAreaChange = (value: string) => {
    console.log('📊 ProjectInfoSection - Surface toiture changée:', value, '-> Propagation immédiate');
    setLocalRoofArea(value);
    if (onRoofAreaChange) {
      onRoofAreaChange(value);
    }
  };

  const handleFloorTypeChange = (value: string) => {
    console.log('📊 ProjectInfoSection - Type plancher changé:', value, '-> Propagation immédiate');
    setLocalFloorType(value);
    if (onFloorTypeChange) {
      onFloorTypeChange(value);
    }
  };

  const handleClimateZoneChange = (value: string) => {
    console.log('🌡️ ProjectInfoSection - Zone climatique changée:', value, '-> Propagation vers ThermalEconomySection');
    setLocalClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };

  const floorTypeOptions = [
    { value: "Béton", label: "🪨 Béton" },
    { value: "Bois", label: "🪵 Bois" },
    { value: "Céramique", label: "🧱 Céramique" }
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
    <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Section Données Techniques */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Données Techniques</h3>
          
          <div className="space-y-4">
            {/* Ligne 1: Type de plancher et Zone climatique CTE */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Type de plancher</label>
                <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {floorTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-2">Zone climatique CTE</label>
                <Select value={localClimateZone} onValueChange={handleClimateZoneChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {climateZoneOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ligne 2: Surface combles et Surface toiture */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface combles (m²)</label>
                <Input 
                  type="number" 
                  value={localSurfaceArea} 
                  onChange={(e) => handleSurfaceAreaChange(e.target.value)}
                  onBlur={(e) => handleSurfaceAreaChange(e.target.value)}
                  className="w-full" 
                  placeholder="Surface des combles"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface toiture (m²)</label>
                <Input 
                  type="number" 
                  value={localRoofArea} 
                  onChange={(e) => handleRoofAreaChange(e.target.value)}
                  onBlur={(e) => handleRoofAreaChange(e.target.value)}
                  className="w-full" 
                  placeholder="Surface de la toiture"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoSection;
