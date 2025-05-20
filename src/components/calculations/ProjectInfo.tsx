
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { VentilationType } from "@/utils/calculationUtils";

interface ProjectInfoProps {
  projectType: string;
  setProjectType: (value: string) => void;
  surfaceArea: string;
  setSurfaceArea: (value: string) => void;
  ventilationType: VentilationType;
  setVentilationType: (value: VentilationType) => void;
  ratioValue: number;
  setRatioValue: (value: number) => void;
  bCoefficientBefore: number;
  bCoefficientAfter: number;
  improvementPercent: number;
  meetsRequirements: boolean;
}

const ProjectInfo = ({
  projectType,
  setProjectType,
  surfaceArea,
  setSurfaceArea,
  ventilationType,
  setVentilationType,
  ratioValue,
  setRatioValue,
  bCoefficientBefore,
  bCoefficientAfter,
  improvementPercent,
  meetsRequirements
}: ProjectInfoProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Informations du Projet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectType">Type de projet</Label>
          <Select 
            value={projectType}
            onValueChange={setProjectType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RES010">RES010 - Enveloppe thermique</SelectItem>
              <SelectItem value="RES020">RES020 - Installations thermiques</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="surfaceArea">Superficie des combles (m²)</Label>
          <Input
            id="surfaceArea"
            value={surfaceArea}
            onChange={(e) => setSurfaceArea(e.target.value)}
            type="number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ventilationType">Type de ventilation</Label>
          <Select 
            value={ventilationType}
            onValueChange={(value: VentilationType) => setVentilationType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner ventilation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caso1">Légèrement ventilé (Caso 1)</SelectItem>
              <SelectItem value="caso2">Très ventilé (Caso 2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ratio">Ratio Ah-nh / Anh-e</Label>
          <Input
            id="ratio"
            value={ratioValue.toString()}
            onChange={(e) => setRatioValue(parseFloat(e.target.value) || 0)}
            type="number"
            step="0.01"
          />
          <p className="text-xs text-gray-500">
            Rapport entre surface isolée et surface totale de l'enveloppe thermique
          </p>
        </div>
        
        <div className="pt-4 space-y-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Coefficient B avant:</span>
            <span className="font-medium">{bCoefficientBefore.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Coefficient B après:</span>
            <span className="font-medium">{bCoefficientAfter.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Amélioration U-value:</span>
            <span className="font-medium">{improvementPercent.toFixed(1)}%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Résultat:</span>
            <Badge variant={meetsRequirements ? "success" : "destructive"}>
              {meetsRequirements ? "Conforme" : "Non conforme"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-medium">Catégorie:</span>
            <Badge>{projectType}</Badge>
          </div>
        </div>
        
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
