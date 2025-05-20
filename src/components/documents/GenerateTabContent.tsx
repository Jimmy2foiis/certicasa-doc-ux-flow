
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileUp, FileTextIcon } from "lucide-react";
import GenerateDocumentButton from "./GenerateDocumentButton";

interface GenerateTabContentProps {
  setActiveTab: (tab: string) => void;
}

const GenerateTabContent = ({ setActiveTab }: GenerateTabContentProps) => {
  return (
    <Card className="bg-white shadow-md">
      <CardContent className="pt-6">
        <div className="text-center p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <FileTextIcon className="h-8 w-8 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-medium mb-3">Générer des Documents</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Utilisez cette section pour générer de nouveaux documents à partir des modèles disponibles. 
            Vous pouvez également ajouter de nouveaux modèles pour les documents spécifiques.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GenerateDocumentButton fullWidth />
            
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("templates")}
              className="flex items-center"
              size="lg"
            >
              <FileUp className="mr-2 h-5 w-5" />
              Ajouter des modèles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerateTabContent;
