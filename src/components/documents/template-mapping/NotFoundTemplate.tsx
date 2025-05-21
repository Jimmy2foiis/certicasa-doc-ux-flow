
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const NotFoundTemplate = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-amber-600">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Modèle invalide
        </CardTitle>
        <CardDescription>
          Le modèle sélectionné est vide ou invalide. Veuillez sélectionner un autre modèle.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-10">
        <Button variant="outline" onClick={() => window.history.back()}>
          Retour à la sélection
        </Button>
      </CardContent>
    </Card>
  );
};
