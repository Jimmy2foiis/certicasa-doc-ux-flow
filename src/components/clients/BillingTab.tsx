
import { Receipt } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BillingTabProps {
  clientId: string;
}

const BillingTab = ({ clientId }: BillingTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturation</CardTitle>
        <CardDescription>Gestion de la facturation du client</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((invoice) => (
            <div 
              key={invoice} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Receipt className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <h4 className="font-medium">Facture #{invoice.toString().padStart(5, '0')}</h4>
                  <p className="text-sm text-gray-500">Date: {`${invoice+10}/05/2023`} - Montant: {1200 * invoice}€</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={invoice !== 3 ? "success" : "outline"}>
                  {invoice !== 3 ? "Payée" : "En attente"}
                </Badge>
                <Button variant="ghost" size="sm">Voir</Button>
                <Button variant="outline" size="sm">Télécharger</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
