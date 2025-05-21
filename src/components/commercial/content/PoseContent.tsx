
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PoseContent = () => {
  return (
    <div className="p-6 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Visites Techniques & Pose</h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Calendar className="mr-2 h-4 w-4" /> Planifier une visite
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-blue-50 pb-2">
            <CardTitle className="text-lg">À planifier</CardTitle>
            <CardDescription>Visites en attente de planification</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {['Bertrand Charles', 'Laurent Émilie'].map((name, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{name}</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">Non planifié</Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">Devis signé le 18/05/2025</div>
                <Button size="sm" variant="outline" className="mt-2 w-full">Planifier</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-amber-50 pb-2">
            <CardTitle className="text-lg">Visites planifiées</CardTitle>
            <CardDescription>Prochaines visites à venir</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {[
              { name: 'Simon Léa', date: '22/05/2025', time: '14:00' },
              { name: 'Roche Antoine', date: '23/05/2025', time: '10:30' }
            ].map((visit, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{visit.name}</span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">Planifié</Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">Le {visit.date} à {visit.time}</div>
                <Button size="sm" variant="outline" className="mt-2 w-full">Voir détails</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-green-50 pb-2">
            <CardTitle className="text-lg">Visites effectuées</CardTitle>
            <CardDescription>Visites récemment terminées</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {[
              { name: 'Fontaine Julie', date: '19/05/2025', status: 'Complet' },
              { name: 'Mercier David', date: '17/05/2025', status: 'À compléter' }
            ].map((visit, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{visit.name}</span>
                  <Badge variant="outline" className={visit.status === 'Complet' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                    {visit.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">Effectuée le {visit.date}</div>
                <Button size="sm" variant="outline" className="mt-2 w-full">Voir rapport</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoseContent;
