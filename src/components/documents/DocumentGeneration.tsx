
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
          <div className="p-10 text-center text-gray-500 bg-gray-50 rounded-md">
            L'historique de génération sera disponible ici.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentGeneration;
