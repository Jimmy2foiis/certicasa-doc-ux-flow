
import React from "react";
import WorkflowManagement from "@/components/workflow/WorkflowManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";

const WorkflowSpace = () => {
  const { setWorkspace } = useWorkspace();

  const switchToCommercial = () => {
    setWorkspace("commercial");
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suivi de projet</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Projets actifs</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-indigo-600">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">En attente d'intervention</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-amber-600">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Interventions aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-green-600">3</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestion de l'espace commercial</CardTitle>
          <CardDescription>
            Accédez à l'espace commercial pour gérer les leads, qualifications, planifications et interventions terrain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            L'espace commercial vous permet de suivre toutes les étapes du parcours client, depuis l'acquisition des leads
            jusqu'à la pose finale, en passant par la qualification commerciale et la planification des rendez-vous.
          </p>
          <Button onClick={switchToCommercial} className="bg-indigo-600 hover:bg-indigo-700">
            <Building2 className="mr-2 h-4 w-4" />
            Accéder à l'espace commercial
          </Button>
        </CardContent>
      </Card>
      
      <WorkflowManagement />
    </div>
  );
};

export default WorkflowSpace;
