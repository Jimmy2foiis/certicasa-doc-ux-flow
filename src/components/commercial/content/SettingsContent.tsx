import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialsAndProductsSection from "@/components/settings/MaterialsAndProductsSection";

const SettingsContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Sauvegarder les modifications
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="materials">Matériaux & Produits</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de l'espace commercial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Nom de l'entreprise</Label>
                  <Input id="company" defaultValue="CertiCasa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" defaultValue="123 rue de Paris, 75001 Paris" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+33 1 23 45 67 89" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="contact@certicasa.fr" type="email" />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-assign">Attribution automatique des leads</Label>
                    <div className="text-sm text-muted-foreground">
                      Attribuer automatiquement les nouveaux leads aux commerciaux
                    </div>
                  </div>
                  <Switch id="auto-assign" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <MaterialsAndProductsSection />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des notifications</CardTitle>
              <CardDescription>
                Configurez les notifications pour l'espace commercial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-leads">Nouveaux leads</Label>
                    <div className="text-sm text-muted-foreground">
                      Notifications pour les nouveaux leads ajoutés
                    </div>
                  </div>
                  <Switch id="new-leads" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="qualification">Rappels de qualification</Label>
                    <div className="text-sm text-muted-foreground">
                      Rappels pour les qualifications en attente
                    </div>
                  </div>
                  <Switch id="qualification" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="planning">Alertes planning</Label>
                    <div className="text-sm text-muted-foreground">
                      Notifications pour les rendez-vous à venir
                    </div>
                  </div>
                  <Switch id="planning" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="stock">Alertes de stock</Label>
                    <div className="text-sm text-muted-foreground">
                      Notifications pour les produits en stock faible
                    </div>
                  </div>
                  <Switch id="stock" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du workflow</CardTitle>
              <CardDescription>
                Personnalisez le processus de suivi commercial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Étapes du pipeline commercial</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {['Lead', 'Qualification', 'Devis envoyé', 'Devis signé', 'Visite technique', 'Pose', 'Terminé'].map((step, index) => (
                      <div key={index} className="flex items-center p-2 border rounded-md">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 mr-2">
                          {index + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-qualification">Qualification automatisée</Label>
                      <div className="text-sm text-muted-foreground">
                        Utiliser des règles pour qualifier automatiquement les leads
                      </div>
                    </div>
                    <Switch id="auto-qualification" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Délais et rappels</CardTitle>
              <CardDescription>
                Configurez les délais et rappels automatiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followup-delay">Délai de relance (jours)</Label>
                  <Input id="followup-delay" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quote-expiry">Expiration des devis (jours)</Label>
                  <Input id="quote-expiry" type="number" defaultValue="30" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres avancés</CardTitle>
              <CardDescription>
                Configuration avancée de l'espace commercial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Clé API</Label>
                <Input id="api-key" defaultValue="sk_live_51JH12KJHASD81231231ASDASHD" type="password" />
              </div>
              
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">Mode de débogage</Label>
                    <div className="text-sm text-muted-foreground">
                      Activer le mode de débogage pour l'assistance technique
                    </div>
                  </div>
                  <Switch id="debug-mode" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="destructive">
                  Réinitialiser tous les paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
