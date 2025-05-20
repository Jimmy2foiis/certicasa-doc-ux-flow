
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GenerateTabContentProps {
  setActiveTab: (tab: string) => void;
}

const GenerateTabContent = ({ setActiveTab }: GenerateTabContentProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center p-8">
          <h2 className="text-lg font-medium mb-2">Générer des Documents</h2>
          <p className="text-gray-500 mb-4">
            Utilisez cette section pour générer de nouveaux documents à partir des modèles disponibles.
          </p>
          <Button onClick={() => setActiveTab("templates")}>
            Ajouter de nouveaux modèles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerateTabContent;
