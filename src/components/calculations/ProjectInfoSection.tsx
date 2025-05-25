
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  const floorTypeOptions = [{
    value: "Béton",
    label: "🪨 Béton"
  }, {
    value: "Bois",
    label: "🪵 Bois"
  }, {
    value: "Céramique",
    label: "🧱 Céramique"
  }];

  const climateZoneOptions = [{
    value: "A3",
    label: "A3"
  }, {
    value: "A4",
    label: "A4"
  }, {
    value: "B3",
    label: "B3"
  }, {
    value: "B4",
    label: "B4"
  }, {
    value: "C1",
    label: "C1"
  }, {
    value: "C2",
    label: "C2"
  }, {
    value: "C3",
    label: "C3"
  }, {
    value: "C4",
    label: "C4"
  }, {
    value: "D1",
    label: "D1"
  }, {
    value: "D2",
    label: "D2"
  }, {
    value: "D3",
    label: "D3"
  }, {
    value: "E1",
    label: "E1"
  }];

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Informations Projet</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Type d'isolation */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Type d'isolation</span>
            <span className="font-medium text-sm">{isolationType}</span>
          </div>
        </div>
        
        {/* Section Données Techniques */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">Données Techniques</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Type de plancher</label>
              <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {floorTypeOptions.map(option => 
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )}
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
                  {climateZoneOptions.map(option => 
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface combles (m²)</label>
                <Input 
                  type="number" 
                  value={localSurfaceArea} 
                  onChange={e => handleSurfaceAreaChange(e.target.value)} 
                  className="w-full" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface toiture (m²)</label>
                <Input 
                  type="number" 
                  value={localRoofArea} 
                  onChange={e => handleRoofAreaChange(e.target.value)} 
                  className="w-full" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section récapitulatif avec badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {/* Type de plancher */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Type de plancher</span>
            <Badge variant="outline" className="w-fit text-xs">
              {localFloorType}
            </Badge>
          </div>
          
          {/* Zone climatique */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Zone climatique</span>
            <Badge variant="outline" className="w-fit text-xs">
              {localClimateZone}
            </Badge>
          </div>
          
          {/* Superficie des combles */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Superficie des combles (m²)</span>
            <Badge variant="secondary" className="w-fit text-xs">
              {localSurfaceArea} m²
            </Badge>
          </div>
          
          {/* Superficie de la toiture */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Superficie de la toiture (m²)</span>
            <Badge variant="secondary" className="w-fit text-xs">
              {localRoofArea} m²
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoSection;
