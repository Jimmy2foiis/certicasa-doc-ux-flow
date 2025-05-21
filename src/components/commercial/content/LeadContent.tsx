
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";

const LeadContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Leads</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <UserCheck className="mr-2 h-4 w-4" /> Nouveau Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-blue-50 pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Nouveaux Leads</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">8</Badge>
            </CardTitle>
            <CardDescription>Prospects récemment ajoutés</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {['Dupont Marc', 'Martin Sophie', 'Bernard Jean'].map((name, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{name}</span>
                  <Badge variant="outline" className="bg-gray-100">Nouveau</Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">Ajouté le 20/05/2025</div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
              Voir tous les leads
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-amber-50 pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>En Qualification</span>
              <Badge variant="outline" className="bg-amber-100 text-amber-800">5</Badge>
            </CardTitle>
            <CardDescription>Leads en cours de qualification</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {['Leroy Pierre', 'Dubois Anne'].map((name, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{name}</span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">Qualification</Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">En attente de validation</div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50">
              Voir tous les leads en qualification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-green-50 pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Confirmés</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">3</Badge>
            </CardTitle>
            <CardDescription>Clients confirmés pour visite technique</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {['Moreau Claude', 'Petit Christine'].map((name, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{name}</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Confirmé</Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">Prêt pour visite technique</div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2 text-green-600 hover:text-green-800 hover:bg-green-50">
              Voir tous les clients confirmés
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadContent;
