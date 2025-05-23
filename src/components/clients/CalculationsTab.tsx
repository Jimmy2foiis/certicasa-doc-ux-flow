
import { Calculator, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExportExcelButton from "../calculations/ExportExcelButton";

interface CalculationsTabProps {
  clientId: string;
  clientName?: string;
  clientAddress?: string;
  savedCalculations: Array<{
    id: string;
    projectId: string;
    projectName: string;
    clientId: string;
    type: string;
    surface: number;
    date: string;
    improvement: number;
    calculationData: any;
  }>;
  onOpenCalculation: (calculation: any) => void;
  onCreateNewCalculation: () => void;
}

const CalculationsTab = ({ 
  clientId, 
  clientName = "Client",
  clientAddress = "",
  savedCalculations = [], // Provide default empty array to prevent undefined
  onOpenCalculation, 
  onCreateNewCalculation 
}: CalculationsTabProps) => {
  // Make sure savedCalculations is always an array
  const calculations = Array.isArray(savedCalculations) ? savedCalculations : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module de Calcul</CardTitle>
        <CardDescription>
          Calculs thermiques et énergétiques pour les projets du client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculations.map((calculation) => (
              <Card key={calculation.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{calculation.projectName}</CardTitle>
                    <Badge variant="success">Enregistré</Badge>
                  </div>
                  <CardDescription>Réhabilitation Énergétique</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Type:</p>
                        <p className="font-medium">{calculation.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Surface:</p>
                        <p className="font-medium">{calculation.surface} m²</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date:</p>
                        <p className="font-medium">{calculation.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Amélioration:</p>
                        <p className="font-medium">
                          {calculation.improvement.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <ExportExcelButton 
                        calculationData={calculation.calculationData} 
                        clientName={clientName}
                        clientAddress={clientAddress}
                        projectName={calculation.projectName}
                      />
                      <Button 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => onOpenCalculation(calculation)}
                      >
                        <Calculator className="h-4 w-4 mr-1" />
                        Voir/Modifier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6">
              <div className="text-center space-y-3">
                <Calculator className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="font-medium">Nouveau Calcul</h3>
                <p className="text-sm text-gray-500">Créer un nouveau module de calcul pour ce client</p>
                <Button 
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                  onClick={onCreateNewCalculation}
                >
                  Créer
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationsTab;
