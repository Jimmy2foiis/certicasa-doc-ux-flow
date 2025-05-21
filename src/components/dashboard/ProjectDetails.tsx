
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface ProjectDetailsProps {
  projectId: string;
}

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Détail du Projet: {projectId}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="tasks">Tâches</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div className="space-y-4">
                <p>Affichage de toutes les informations détaillées du projet sélectionné.</p>
                <p className="text-gray-500">Cette section sera enrichie avec des données réelles du projet.</p>
              </div>
            </TabsContent>
            <TabsContent value="documents">
              <div className="space-y-4">
                <p>Liste des documents associés au projet.</p>
                <p className="text-gray-500">Cette section sera enrichie avec les documents du projet.</p>
              </div>
            </TabsContent>
            <TabsContent value="tasks">
              <div className="space-y-4">
                <p>Liste des tâches à réaliser pour ce projet.</p>
                <p className="text-gray-500">Cette section sera enrichie avec les tâches du projet.</p>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="space-y-4">
                <p>Historique des actions et modifications du projet.</p>
                <p className="text-gray-500">Cette section sera enrichie avec l'historique du projet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
