
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TrainingContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Outils de formation</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Nouvelle ressource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guides commerciaux</CardTitle>
            <CardDescription>
              Documents pour accompagner vos démarches commerciales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Guide de qualification client', type: 'PDF', date: '10/04/2025' },
              { title: 'Argumentaire commercial', type: 'DOCX', date: '15/03/2025' },
              { title: 'Questions fréquentes', type: 'PDF', date: '01/05/2025' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div>
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-sm text-gray-500">Mis à jour le {doc.date}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>{doc.type}</Badge>
                  <Button variant="ghost" size="sm">
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vidéos de formation</CardTitle>
            <CardDescription>
              Tutoriels et formations en vidéo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Présenter nos solutions', duration: '10:25', date: '12/04/2025' },
              { title: 'Répondre aux objections', duration: '15:48', date: '22/04/2025' },
              { title: 'Processus de visite technique', duration: '08:32', date: '05/05/2025' }
            ].map((video, index) => (
              <div key={index} className="p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{video.title}</div>
                  <Badge variant="outline">{video.duration}</Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">Ajouté le {video.date}</div>
                <div className="mt-2 h-24 bg-gray-100 rounded flex items-center justify-center">
                  <Button variant="outline" size="sm">Regarder</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formations à venir</CardTitle>
            <CardDescription>
              Calendrier des prochaines sessions de formation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Maîtriser les techniques de vente', date: '25/05/2025', type: 'En ligne', places: '5 places restantes' },
              { title: 'Produits avancés', date: '02/06/2025', type: 'Présentiel', places: '3 places restantes' },
              { title: 'Certification commerciale', date: '10/06/2025', type: 'Hybride', places: '8 places restantes' }
            ].map((training, index) => (
              <div key={index} className="p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{training.title}</div>
                  <Badge variant="outline" className={
                    training.type === 'En ligne' ? 'bg-blue-100 text-blue-800' :
                    training.type === 'Présentiel' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }>
                    {training.type}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1">Le {training.date} • {training.places}</div>
                <Button size="sm" className="mt-2 w-full">S'inscrire</Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">Voir toutes les formations</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingContent;
