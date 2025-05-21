
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ParrainageContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parrainage</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Nouveau Parrainage
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programme de parrainage</CardTitle>
          <CardDescription>
            Suivez vos parrainages et leurs statuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Parrainages actifs</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold text-indigo-600">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Prospects parrainés</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold text-amber-600">5</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">En attente de validation</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold text-blue-600">3</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Parrainages convertis</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold text-green-600">4</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="border rounded-md">
              <div className="grid grid-cols-4 p-3 bg-gray-50 font-medium border-b">
                <div>Parrain</div>
                <div>Filleul</div>
                <div>Date de parrainage</div>
                <div>Statut</div>
              </div>
              {[
                { parrain: 'Dupont Marc', filleul: 'Martin Sophie', date: '10/05/2025', status: 'Converti' },
                { parrain: 'Bernard Jean', filleul: 'Leroy Pierre', date: '12/05/2025', status: 'En attente' },
                { parrain: 'Moreau Claude', filleul: 'Dubois Anne', date: '15/05/2025', status: 'En contact' },
                { parrain: 'Petit Christine', filleul: 'Garcia Elena', date: '18/05/2025', status: 'Converti' }
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-4 p-3 border-b hover:bg-gray-50">
                  <div>{item.parrain}</div>
                  <div>{item.filleul}</div>
                  <div>{item.date}</div>
                  <div>
                    <Badge className={
                      item.status === 'Converti' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                      item.status === 'En attente' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                      'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParrainageContent;
