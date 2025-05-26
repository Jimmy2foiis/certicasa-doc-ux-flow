
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

  const handleSurfaceAreaChange = (value: string) => {
    console.log('📊 ProjectInfoSection - Surface combles changée:', value, '-> Propagation immédiate');
    setLocalSurfaceArea(value);
    if (onSurfaceAreaChange) {
      // Propagation immédiate pour synchroniser avec les calculs
      onSurfaceAreaChange(value);
    }
  };

  const handleRoofAreaChange = (value: string) => {
    console.log('📊 ProjectInfoSection - Surface toiture changée:', value, '-> Propagation immédiate');
    setLocalRoofArea(value);
    if (onRoofAreaChange) {
      // Propagation immédiate pour synchroniser avec les calculs
      onRoofAreaChange(value);
    }
  };

  const handleFloorTypeChange = (value: string) => {
    console.log('📊 ProjectInfoSection - Type plancher changé:', value, '-> Propagation immédiate');
    setLocalFloorType(value);
    if (onFloorTypeChange) {
      // Propagation immédiate pour synchroniser avec les matériaux
      onFloorTypeChange(value);
    }
  };

  const floorTypeOptions = [
    { value: "Béton", label: "🪨 Béton" },
    { value: "Bois", label: "🪵 Bois" },
    { value: "Céramique", label: "🧱 Céramique" }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Section Données Techniques */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Données Techniques</h3>
          
          <div className="space-y-4">
            {/* Ligne 1: Type de plancher seulement */}
            <div className="grid grid-cols-1 gap-3">
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
            </div>

            {/* Ligne 2: Surface combles et Surface toiture (2 colonnes) */}
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
