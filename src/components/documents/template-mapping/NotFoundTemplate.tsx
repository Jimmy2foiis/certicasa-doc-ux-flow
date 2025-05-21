
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TemplateValidationState } from "@/types/documents";

interface NotFoundTemplateProps {
  reason: TemplateValidationState;
}

export const NotFoundTemplate = ({ reason }: NotFoundTemplateProps) => {
  const messages = {
    'empty': "Le contenu du modèle est vide",
    'invalid': "Le modèle est invalide ou endommagé",
    'no-tags': "Aucune variable n'a été détectée dans le modèle",
    'unknown': "Une erreur s'est produite lors du chargement du modèle"
  };

  return (
    <div className="p-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">Modèle invalide</h3>
      <p className="text-gray-500 mb-4">{messages[reason]}</p>
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Veuillez vérifier que le modèle contient des variables au format {'{{variable}}'} et réessayer.
        </AlertDescription>
      </Alert>
    </div>
  );
};
