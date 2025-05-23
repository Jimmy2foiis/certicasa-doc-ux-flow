import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileUp, FileTextIcon, Check } from "lucide-react";
import GenerateDocumentButton from "./GenerateDocumentButton";
import type { DocumentTemplate } from "@/types/documents";

interface GenerateTabContentProps {
  setActiveTab: (tab: string) => void;
}

const GenerateTabContent = ({ setActiveTab }: GenerateTabContentProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // Récupérer le template sélectionné depuis sessionStorage
  useEffect(() => {
    const storedTemplate = sessionStorage.getItem('selectedTemplate');
    if (storedTemplate) {
      try {
        setSelectedTemplate(JSON.parse(storedTemplate));
      } catch (error) {
        console.error("Erreur lors de la récupération du template:", error);
      }
    }
  }, []);

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="pt-6">
        <div className="text-center p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <FileTextIcon className="h-8 w-8 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-medium mb-3">Générer des Documents</h2>
          
          {selectedTemplate ? (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                <Check className="h-5 w-5" />
                <p className="font-medium">Modèle sélectionné</p>
              </div>
              <div className="p-4 border rounded-md bg-gray-50 inline-block">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${selectedTemplate.type === 'docx' ? 'bg-blue-100' : 'bg-red-100'}`}>
                    <FileText className={`h-5 w-5 ${selectedTemplate.type === 'docx' ? 'text-blue-600' : 'text-red-600'}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{selectedTemplate.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedTemplate.type.toUpperCase()} - Ajouté le {selectedTemplate.dateUploaded}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Utilisez cette section pour générer de nouveaux documents à partir des modèles disponibles. 
              Vous pouvez également ajouter de nouveaux modèles pour les documents spécifiques.
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GenerateDocumentButton 
              fullWidth 
              templateId={selectedTemplate?.id}
            />
            
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveTab("templates");
                // Effacer le template sélectionné si on va à l'onglet des templates
                sessionStorage.removeItem('selectedTemplate');
              }}
              className="flex items-center"
              size="lg"
            >
              <FileUp className="mr-2 h-5 w-5" />
              {selectedTemplate ? "Changer de modèle" : "Ajouter des modèles"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerateTabContent;
