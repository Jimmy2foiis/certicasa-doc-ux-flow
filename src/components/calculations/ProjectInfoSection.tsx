
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ProjectInfoSectionProps {
  isolationType?: string;
  floorType?: string;
  climateZone?: string;
  surfaceArea: string;
  roofArea: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
}

const ProjectInfoSection = ({
  isolationType = "Combles",
  floorType = "Bois", 
  climateZone = "C",
  surfaceArea,
  roofArea,
  onSurfaceAreaChange,
  onRoofAreaChange
}: ProjectInfoSectionProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Informations Projet</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Type d'isolation */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Type d'isolation</span>
            <span className="font-medium text-sm">{isolationType}</span>
          </div>
          
          {/* Type de plancher */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Type de plancher</span>
            <span className="font-medium text-sm">{floorType}</span>
          </div>
          
          {/* Zone climatique */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Zone climatique</span>
            <Badge variant="outline" className="w-fit text-xs">
              {climateZone}
            </Badge>
          </div>
          
          {/* Superficie des combles */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Superficie des combles (m²)</span>
            <Input
              type="number"
              value={surfaceArea}
              onChange={(e) => onSurfaceAreaChange?.(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          
          {/* Superficie de la toiture */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Superficie de la toiture (m²)</span>
            <Input
              type="number"
              value={roofArea}
              onChange={(e) => onRoofAreaChange?.(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoSection;
