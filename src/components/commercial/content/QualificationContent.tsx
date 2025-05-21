
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const QualificationContent = () => {
  return (
    <div className="p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Qualification des Prospects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appels à effectuer</CardTitle>
            <CardDescription>
              Liste des prospects à contacter aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            {['Durand Philippe', 'Lambert Michel', 'Fournier Thomas'].map((name, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b last:border-0">
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-gray-500">+33 6 12 34 56 78</div>
                </div>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Appeler
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Suivi des interactions</CardTitle>
            <CardDescription>
              Derniers échanges avec les prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {[
              { name: 'Garcia Elena', action: 'Email envoyé', date: 'Aujourd\'hui, 10:30' },
              { name: 'Bonnet Paul', action: 'Appel effectué', date: 'Hier, 14:15' },
              { name: 'Girard Marie', action: 'Document envoyé', date: '20/05/2025' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b last:border-0">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.action}</div>
                </div>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualificationContent;
