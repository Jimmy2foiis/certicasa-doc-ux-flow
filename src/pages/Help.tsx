
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const faqItems = [
    {
      question: "Comment créer un nouveau client ?",
      answer: "Pour créer un nouveau client, rendez-vous dans la section 'Clients' et cliquez sur le bouton 'Ajouter un client'. Remplissez ensuite le formulaire avec les informations du client."
    },
    {
      question: "Comment effectuer un calcul de projet ?",
      answer: "Allez dans la section 'Calculs', sélectionnez le type de calcul souhaité et remplissez les informations nécessaires. Vous pouvez ensuite visualiser et exporter les résultats."
    },
    {
      question: "Comment générer un document ?",
      answer: "Dans la section 'Documents', choisissez le modèle de document souhaité, sélectionnez le client concerné et remplissez les champs requis. Vous pourrez ensuite télécharger ou envoyer le document."
    },
    {
      question: "Comment accéder à la facturation ?",
      answer: "La section 'Facturation' vous permet de créer, consulter et gérer vos factures. Vous pouvez filtrer les factures par client, par date ou par statut."
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Aide et Support</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Foire aux questions</CardTitle>
                <CardDescription>Les questions les plus fréquemment posées</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Besoin d'aide supplémentaire ?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Si vous avez besoin d'assistance supplémentaire, n'hésitez pas à contacter notre équipe de support :</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Email: support@example.com</li>
                    <li>Téléphone: 01 23 45 67 89</li>
                    <li>Horaires: Du lundi au vendredi, 9h-18h</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
