
import { Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ProjectsTabContentProps {
  onShowCalculation?: (projectId?: string) => void;
  clientId?: string; // Added clientId prop
}

const ProjectsTabContent = ({ onShowCalculation, clientId }: ProjectsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Maison</CardTitle>
        <CardDescription>
          Informations Maison associées au client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2].map((project) => (
            <Card key={project}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                      <Home className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Réhabilitation Énergétique #{project}</h4>
                      <p className="text-sm text-gray-500">RES020 - Isolation Façade</p>
                    </div>
                  </div>
                  <Badge variant="success">En cours</Badge>
                </div>
                
                <div className="mt-4 grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-gray-500">Surface</p>
                    <p className="font-medium">127 m²</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Créé le</p>
                    <p className="font-medium">12/05/2023</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fin prévue</p>
                    <p className="font-medium">28/07/2023</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">Voir détails</Button>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => onShowCalculation && onShowCalculation(`project_${project}`)}
                  >
                    Calculs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsTabContent;
