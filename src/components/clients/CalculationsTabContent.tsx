
import { Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CalculationsTabContentProps {
  onShowCalculation?: (projectId?: string) => void;
}

const CalculationsTabContent = ({ onShowCalculation }: CalculationsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculs énergétiques</CardTitle>
        <CardDescription>
          Calculs et simulations énergétiques pour ce client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2].map((calc) => (
            <Card key={calc}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center text-green-600">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Calcul énergétique #{calc}</h4>
                      <p className="text-sm text-gray-500">Projet: Réhabilitation Énergétique #{calc}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Complété</Badge>
                </div>
                
                <div className="mt-4 grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">Thermique</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">18/05/2023</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amélioration</p>
                    <p className="font-medium">{35 + calc * 5}%</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">Télécharger PDF</Button>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => onShowCalculation && onShowCalculation(`project_${calc}`)}
                  >
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        
          <Card className="border-dashed border-2">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Calculator className="h-12 w-12 text-gray-400 mb-3 mt-3" />
              <h4 className="font-medium mb-2">Nouveau calcul</h4>
              <p className="text-sm text-gray-500 text-center mb-4">
                Créer un nouveau calcul énergétique pour ce client
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onShowCalculation && onShowCalculation()}
              >
                Créer un calcul
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationsTabContent;
