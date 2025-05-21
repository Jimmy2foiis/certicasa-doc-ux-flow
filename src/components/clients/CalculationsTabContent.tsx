
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CalculationsTabContentProps {
  clientId?: string; // Added clientId prop
  clientName?: string;
  clientAddress?: string;
  savedCalculations?: any[];
  onOpenCalculation?: (calculationId?: string) => void;
  onCreateNewCalculation?: () => void;
}

const CalculationsTabContent = ({ 
  clientId,
  clientName = "Client", 
  clientAddress = "Adresse non définie", 
  savedCalculations = [], 
  onOpenCalculation, 
  onCreateNewCalculation 
}: CalculationsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculs thermiques</CardTitle>
        <CardDescription>
          Calculs associés à {clientName}{clientAddress ? ` (${clientAddress})` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savedCalculations && savedCalculations.length > 0 ? (
          <div className="space-y-4">
            {savedCalculations.map((calculation, index) => (
              <Card key={calculation.id || index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calculator className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{calculation.type || `Calcul #${index + 1}`}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Surface: {calculation.surface || "N/A"} m²</span>
                          <span>•</span>
                          <span>Amélioration: {calculation.improvement || "N/A"}%</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onOpenCalculation && onOpenCalculation(calculation.id)}
                    >
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucun calcul disponible</h3>
            <p className="text-gray-600 mb-4">
              Aucun calcul thermique n'a été effectué pour ce client.
            </p>
            <Button onClick={() => onCreateNewCalculation && onCreateNewCalculation()}>
              Créer un nouveau calcul
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationsTabContent;
