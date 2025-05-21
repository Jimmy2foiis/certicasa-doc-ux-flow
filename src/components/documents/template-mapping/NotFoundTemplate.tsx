
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText } from "lucide-react";

interface NotFoundTemplateProps {
  reason?: 'empty' | 'invalid' | 'no-tags' | 'unknown';
}

export const NotFoundTemplate = ({ reason = 'unknown' }: NotFoundTemplateProps) => {
  const getErrorMessage = () => {
    switch (reason) {
      case 'empty':
        return "Le modèle sélectionné est vide. Veuillez téléverser un nouveau modèle.";
      case 'no-tags':
        return "Aucune variable détectée dans ce modèle. Utilisez un modèle .docx avec des balises {{variable}}.";
      case 'invalid':
        return "Le format du modèle n'est pas compatible. Utilisez de préférence un fichier .docx.";
      default:
        return "Le modèle sélectionné est invalide. Veuillez sélectionner un autre modèle.";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-amber-600">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Modèle invalide
        </CardTitle>
        <CardDescription>
          {getErrorMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-md border">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <FileText className="h-4 w-4 mr-2" /> 
            Conseils pour un modèle valide :
          </h3>
          <ul className="text-sm space-y-2 text-slate-700">
            <li>• Utilisez un fichier .docx (Microsoft Word) pour une compatibilité optimale</li>
            <li>• Insérez des balises au format <code>{{nom_variable}}</code> dans votre document</li>
            <li>• Exemples de balises : <code>{{nom}}</code>, <code>{{adresse}}</code>, <code>{{client.email}}</code></li>
            <li>• Les PDF sont acceptés uniquement s'ils sont générés depuis Word et conservent les balises en texte</li>
          </ul>
        </div>
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Retour à la sélection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
