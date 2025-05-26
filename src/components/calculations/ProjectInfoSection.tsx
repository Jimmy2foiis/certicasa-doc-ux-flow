import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { SafetyCultureService } from "@/services/safetyCultureService";
import { useToast } from "@/components/ui/use-toast";
interface ProjectInfoSectionProps {
  isolationType?: string;
  floorType?: string;
  climateZone?: string;
  surfaceArea: string;
  roofArea: string;
  clientId?: string; // Ajouté pour identifier le projet
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
  // Nouvelles props pour la géolocalisation
  climateConfidence?: number;
  climateMethod?: string;
  climateReferenceCity?: string;
  climateDistance?: number;
  climateDescription?: string;
}
const ProjectInfoSection = ({
  isolationType = "Combles",
  floorType = "Bois",
  climateZone = "C3",
  surfaceArea,
  roofArea,
  clientId,
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange,
  climateConfidence,
  climateMethod,
  climateReferenceCity,
  climateDistance,
  climateDescription
}: ProjectInfoSectionProps) => {
  const [localSurfaceArea, setLocalSurfaceArea] = useState(surfaceArea);
  const [localRoofArea, setLocalRoofArea] = useState(roofArea);
  const [localFloorType, setLocalFloorType] = useState(floorType);
  const [localClimateZone, setLocalClimateZone] = useState(climateZone);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const {
    toast
  } = useToast();
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
    console.log('🌡️ ProjectInfoSection - Géolocalisation:', {
      climateMethod,
      climateReferenceCity,
      climateConfidence
    });
    setLocalClimateZone(climateZone);
  }, [climateZone, climateMethod, climateReferenceCity, climateConfidence]);
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
    console.log('🌡️ ProjectInfoSection - Zone climatique changée manuellement:', value, '-> Propagation vers parent');
    setLocalClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };
  const handleSafetyCultureReport = async () => {
    if (!clientId) {
      toast({
        title: "Erreur",
        description: "ID du projet non disponible",
        variant: "destructive"
      });
      return;
    }
    setIsLoadingReport(true);
    try {
      const reportUrl = await SafetyCultureService.getSafetyCultureReportURL(clientId);
      if (reportUrl) {
        window.open(reportUrl, '_blank');
        toast({
          title: "Rapport ouvert",
          description: "Le rapport SafetyCulture s'ouvre dans un nouvel onglet"
        });
      } else {
        toast({
          title: "Rapport non disponible",
          description: "Le rapport SafetyCulture n'est pas encore disponible pour ce projet"
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du rapport:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au rapport SafetyCulture",
        variant: "destructive"
      });
    } finally {
      setIsLoadingReport(false);
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
  return <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Section Données Techniques */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Données Techniques</h3>
          
          <div className="space-y-6">
            {/* Ligne 1: Type de plancher et Bouton SafetyCulture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Type de plancher</label>
                <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {floorTypeOptions.map(option => <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="lg:col-span-1">
                <label className="block text-sm text-gray-500 mb-2">Rapport de chantier</label>
                <Button 
                  onClick={handleSafetyCultureReport} 
                  disabled={isLoadingReport} 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {isLoadingReport ? "Chargement..." : "Consulter le rapport SafetyCulture"}
                </Button>
              </div>
            </div>

            {/* Ligne 2: Surface combles et Surface toiture */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface combles (m²)</label>
                <Input type="number" value={localSurfaceArea} onChange={e => handleSurfaceAreaChange(e.target.value)} onBlur={e => handleSurfaceAreaChange(e.target.value)} className="w-full" placeholder="Surface des combles" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface toiture (m²)</label>
                <Input type="number" value={localRoofArea} onChange={e => handleRoofAreaChange(e.target.value)} onBlur={e => handleRoofAreaChange(e.target.value)} className="w-full" placeholder="Surface de la toiture" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ProjectInfoSection;
