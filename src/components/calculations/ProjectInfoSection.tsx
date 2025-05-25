
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectInfoSectionProps {
  isolationType?: string;
  floorType?: string;
  climateZone?: string;
  surfaceArea: string;
  roofArea: string;
}

const ProjectInfoSection = ({
  isolationType = "Combles",
  floorType = "Bois",
  climateZone = "C3",
  surfaceArea,
  roofArea
}: ProjectInfoSectionProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Informations Projet</CardTitle>
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
            <Badge variant="outline" className="w-fit text-xs">
              {floorType}
            </Badge>
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
            <Badge variant="secondary" className="w-fit text-xs">
              {surfaceArea} m²
            </Badge>
          </div>
          
          {/* Superficie de la toiture */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Superficie de la toiture (m²)</span>
            <Badge variant="secondary" className="w-fit text-xs">
              {roofArea} m²
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoSection;
