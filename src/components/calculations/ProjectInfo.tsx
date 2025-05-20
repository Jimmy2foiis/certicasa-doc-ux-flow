
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";

interface ProjectInfoProps {
  projectType: string;
  setProjectType: (value: string) => void;
  surfaceArea: string;
  setSurfaceArea: (value: string) => void;
  roofArea: string;
  setRoofArea: (value: string) => void;
  improvementPercent: number;
  meetsRequirements: boolean;
}

const ProjectInfo = ({
  projectType,
  setProjectType,
  surfaceArea,
  setSurfaceArea,
  roofArea,
  setRoofArea,
  improvementPercent,
  meetsRequirements,
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
          <Label htmlFor="roofArea">Superficie de la toiture (m²)</Label>
          <Input
            id="roofArea"
            value={roofArea}
            onChange={(e) => setRoofArea(e.target.value)}
            type="number"
          />
        </div>
        
        <div className="pt-4 space-y-2 border-t">
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
