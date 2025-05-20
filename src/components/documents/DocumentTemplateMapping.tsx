
import { useState } from "react";
import { FileText, Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Mock available template variables by category
const availableVariables = {
  client: ["nom", "prénom", "email", "téléphone", "adresse", "ville", "code_postal", "pays"],
  projet: ["nom", "type", "surface", "description", "date_début", "date_fin"],
  cadastre: ["référence", "coordonnées_utm", "utm_zone", "zone_climatique"],
  calcul: ["type", "résultat", "économie", "amélioration"],
  rdv: ["date", "heure", "lieu", "commercial", "notes"],
};

type TemplateTag = { 
  tag: string;
  category: string;
  mappedTo: string;
};

// Mock detected tags from template
const mockDetectedTags = [
  { tag: "{{nom}}", category: "client", mappedTo: "client.nom" },
  { tag: "{{adresse}}", category: "client", mappedTo: "client.adresse" },
  { tag: "{{utm.zone}}", category: "cadastre", mappedTo: "cadastre.utm_zone" },
  { tag: "{{surface}}", category: "projet", mappedTo: "projet.surface" },
  { tag: "{{date_rdv}}", category: "rdv", mappedTo: "rdv.date" },
];

const DocumentTemplateMapping = () => {
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>(mockDetectedTags);
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("client");
  const { toast } = useToast();
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const formattedTag = newTag.includes("{{") ? newTag : `{{${newTag}}}`;
    
    setTemplateTags([
      ...templateTags, 
      { 
        tag: formattedTag, 
        category: activeCategory, 
        mappedTo: `${activeCategory}.${newTag.replace(/[{}]/g, "")}` 
      }
    ]);
    
    setNewTag("");
    
    toast({
      title: "Balise ajoutée",
      description: `La balise ${formattedTag} a été ajoutée à la liste.`,
    });
  };
  
  const updateMapping = (index: number, value: string) => {
    const updatedTags = [...templateTags];
    updatedTags[index].mappedTo = value;
    setTemplateTags(updatedTags);
  };
  
  const saveMapping = () => {
    // Here we would save the mapping to a database or state management
    toast({
      title: "Configuration sauvegardée",
      description: "Le mapping des variables a été sauvegardé avec succès.",
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Mapping des variables</CardTitle>
        <CardDescription>
          Configurez la correspondance entre les balises du modèle et les données du CRM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Ajouter une nouvelle balise</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Exemple: nom, prénom, adresse..." 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button onClick={handleAddTag}>
                Ajouter
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Les balises seront formatées automatiquement comme {{balise}}
            </p>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-3">Balises détectées dans le modèle</h3>
            <div className="space-y-3">
              {templateTags.map((tag, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Badge variant="outline" className="min-w-[150px] justify-center">
                    {tag.tag}
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <div className="flex-1">
                    <Input 
                      value={tag.mappedTo}
                      onChange={(e) => updateMapping(index, e.target.value)}
                    />
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    {tag.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Variables disponibles</h3>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="mb-2">
                {Object.keys(availableVariables).map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(availableVariables).map(([category, variables]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {variables.map(variable => (
                        <Badge 
                          key={variable} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-slate-200"
                          onClick={() => setNewTag(variable)}
                        >
                          {`${category}.${variable}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="border rounded-md p-4 bg-blue-50">
            <h3 className="font-medium mb-2 flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              Prévisualisation du document
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Voici comment les variables seront remplacées dans le document final.
            </p>
            <div className="border bg-white rounded p-3 text-sm space-y-2">
              <div>
                <span className="font-medium">Nom:</span> Jean Dupont
              </div>
              <div>
                <span className="font-medium">Adresse:</span> Rue Serrano 120, 28006 Madrid
              </div>
              <div>
                <span className="font-medium">Zone UTM:</span> 30T
              </div>
              <div>
                <span className="font-medium">Surface:</span> 127 m²
              </div>
              <div>
                <span className="font-medium">Date de rendez-vous:</span> 21/05/2025
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveMapping} className="ml-auto">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder la configuration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentTemplateMapping;
