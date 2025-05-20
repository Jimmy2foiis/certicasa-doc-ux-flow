
import { FileText, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Liste complète des variables disponibles par catégorie
const variablesList = {
  client: [
    { name: "nom", description: "Nom du client" },
    { name: "prénom", description: "Prénom du client" },
    { name: "nom_complet", description: "Prénom et nom du client" },
    { name: "email", description: "Adresse email du client" },
    { name: "téléphone", description: "Numéro de téléphone" },
    { name: "adresse", description: "Adresse complète" },
    { name: "rue", description: "Rue de l'adresse" },
    { name: "numéro", description: "Numéro de rue" },
    { name: "ville", description: "Ville" },
    { name: "code_postal", description: "Code postal" },
    { name: "pays", description: "Pays" },
    { name: "nif", description: "Numéro d'identification fiscale" }
  ],
  projet: [
    { name: "nom", description: "Nom du projet" },
    { name: "type", description: "Type de projet (réhabilitation, etc)" },
    { name: "surface", description: "Surface en m²" },
    { name: "description", description: "Description du projet" },
    { name: "date_début", description: "Date de début du projet" },
    { name: "date_fin", description: "Date de fin estimée" },
    { name: "statut", description: "Statut actuel du projet" }
  ],
  cadastre: [
    { name: "référence", description: "Référence cadastrale complète" },
    { name: "coordonnées_utm", description: "Coordonnées UTM" },
    { name: "utm_zone", description: "Zone UTM (ex: 30T, 31S, etc)" },
    { name: "zone_climatique", description: "Zone climatique selon CTE" },
    { name: "parcelle", description: "Identifiant de parcelle" },
    { name: "municipalité", description: "Municipalité cadastrale" }
  ],
  calcul: [
    { name: "type", description: "Type de calcul effectué" },
    { name: "résultat", description: "Résultat principal du calcul" },
    { name: "économie", description: "Économie estimée en %" },
    { name: "économie_euros", description: "Économie estimée en euros" },
    { name: "amélioration", description: "Amélioration énergétique en %" },
    { name: "classe_initiale", description: "Classe énergétique initiale" },
    { name: "classe_finale", description: "Classe énergétique après travaux" }
  ],
  rdv: [
    { name: "date", description: "Date du rendez-vous" },
    { name: "heure", description: "Heure du rendez-vous" },
    { name: "lieu", description: "Lieu du rendez-vous" },
    { name: "commercial", description: "Nom du commercial" },
    { name: "notes", description: "Notes sur le rendez-vous" }
  ],
  document: [
    { name: "titre", description: "Titre du document" },
    { name: "date_création", description: "Date de création" },
    { name: "créé_par", description: "Auteur du document" },
    { name: "type", description: "Type de document" },
    { name: "numéro", description: "Numéro de référence" }
  ]
};

const DocumentVariablesList = () => {
  const { toast } = useToast();

  const copyToClipboard = (variable: string, category: string) => {
    navigator.clipboard.writeText(`{{${category}.${variable}}}`);
    toast({
      title: "Copié !",
      description: `La variable {{${category}.${variable}}} a été copiée dans le presse-papiers.`,
      duration: 2000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des variables disponibles</CardTitle>
        <CardDescription>
          Utilisez ces variables dans vos modèles de documents pour une génération dynamique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="client">
          <TabsList className="mb-4">
            {Object.keys(variablesList).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(variablesList).map(([category, variables]) => (
            <TabsContent key={category} value={category}>
              <div className="border rounded-lg">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Variables de type "{category}"
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Utilisez ces variables avec la syntaxe <code>{{`{{${category}.nom_variable}}`}}</code>
                  </p>
                </div>
                <div className="divide-y">
                  {variables.map((variable) => (
                    <div key={variable.name} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <div>
                        <code className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-600">
                          {{`{{${category}.${variable.name}}}`}}
                        </code>
                        <p className="text-sm text-gray-600 mt-1">{variable.description}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(variable.name, category)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentVariablesList;
