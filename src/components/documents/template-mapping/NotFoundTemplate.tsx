
import React from "react";
import { AlertCircle } from "lucide-react";

export const NotFoundTemplate = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
      <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Modèle non trouvé</h3>
      <p className="text-center text-gray-500">
        Le modèle sélectionné n'a pas pu être chargé ou n'existe plus.
        <br />
        Veuillez sélectionner un autre modèle ou contacter l'administrateur.
      </p>
    </div>
  );
};
