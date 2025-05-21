
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const HelpContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Centre d'aide</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Contacter le support
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comment pouvons-nous vous aider ?</CardTitle>
          <CardDescription>
            Recherchez dans notre base de connaissances ou parcourez les catégories ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher une question ou un sujet..." className="pl-8" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
            <CardDescription>
              Réponses aux questions les plus courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment ajouter un nouveau lead ?</AccordionTrigger>
                <AccordionContent>
                  Pour ajouter un nouveau lead, cliquez sur le bouton "Nouveau Lead" en haut à droite de l'écran dans la section Lead. 
                  Remplissez ensuite le formulaire avec les informations du prospect et cliquez sur "Sauvegarder".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Comment planifier une visite technique ?</AccordionTrigger>
                <AccordionContent>
                  Pour planifier une visite technique, allez dans la section "VT & Pose", puis cliquez sur le bouton "Planifier une visite". 
                  Sélectionnez le client, la date, l'heure et l'équipe qui effectuera la visite, puis confirmez.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Comment suivre mes parrainages ?</AccordionTrigger>
                <AccordionContent>
                  Tous vos parrainages sont visibles dans la section "Parrainage". Vous pouvez y voir le statut de chaque parrainage, 
                  ajouter de nouveaux filleuls et suivre les conversions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Comment gérer les stocks de produits ?</AccordionTrigger>
                <AccordionContent>
                  La gestion des stocks se fait dans la section "Produits & Stocks". Vous pouvez y voir l'état des stocks, 
                  ajouter de nouveaux produits ou mettre à jour les quantités existantes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guides et tutoriels</CardTitle>
            <CardDescription>
              Documents et guides pour vous aider à utiliser la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Guide de démarrage rapide', description: 'Les bases pour bien débuter avec l\'espace commercial' },
              { title: 'Processus de qualification', description: 'Comment qualifier efficacement vos prospects' },
              { title: 'Utiliser le planning', description: 'Guide pour optimiser la gestion de votre planning' },
              { title: 'Rapport de visite technique', description: 'Comment remplir et soumettre un rapport de visite' }
            ].map((guide, index) => (
              <div key={index} className="p-3 border rounded-md hover:bg-gray-50">
                <div className="font-medium">{guide.title}</div>
                <div className="text-sm text-gray-500 mt-1">{guide.description}</div>
                <Button variant="link" className="px-0 mt-1" size="sm">
                  Consulter le guide
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Besoin d'aide supplémentaire ?</CardTitle>
          <CardDescription>
            Notre équipe de support est disponible pour vous aider
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" className="flex-1">
            Centre de support en ligne
          </Button>
          <Button variant="outline" className="flex-1">
            Documentation complète
          </Button>
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
            Demande d'assistance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpContent;
