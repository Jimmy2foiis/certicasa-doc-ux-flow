
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DocumentTemplateUpload from "./DocumentTemplateUpload";
import DocumentTemplateMapping from "./DocumentTemplateMapping";
import DocumentVariablesList from "./DocumentVariablesList";
import GenerateDocumentButton from "./GenerateDocumentButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock } from "lucide-react";

// Mock document generation history
const generationHistory = [
  { id: "1", name: "Devis Client Dupont", date: "20/05/2025", status: "Généré" },
  { id: "2", name: "Contrat Martin", date: "19/05/2025", status: "Signé" },
  { id: "3", name: "Facture Projet Maison", date: "18/05/2025", status: "Envoyé" },
];

const DocumentGeneration = () => {
  const [activeTab, setActiveTab] = useState("templates");
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Modèles de documents</TabsTrigger>
          <TabsTrigger value="variables">Variables disponibles</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-6">
          <DocumentTemplateUpload />
          <DocumentTemplateMapping />
        </TabsContent>
        
        <TabsContent value="variables">
          <DocumentVariablesList />
        </TabsContent>
        
        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique de génération</CardTitle>
            </CardHeader>
            <CardContent>
              {generationHistory.length > 0 ? (
                <div className="space-y-4">
                  {generationHistory.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{item.status}</span>
                        <GenerateDocumentButton variant="outline" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 bg-gray-50 rounded-md">
                  <p className="mb-4">Aucun historique de génération disponible.</p>
                  <GenerateDocumentButton fullWidth />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentGeneration;
