
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Paramètres</h1>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="company">Entreprise</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil Utilisateur</CardTitle>
                    <CardDescription>
                      Gérez vos informations personnelles et préférences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" defaultValue="Jean Dupont" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Rôle</Label>
                        <Input id="role" defaultValue="Administrateur" disabled />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>Enregistrer</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="company">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Entreprise</CardTitle>
                    <CardDescription>
                      Gérez les informations de votre entreprise
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Nom de l'entreprise</Label>
                        <Input id="company-name" defaultValue="CertiCasa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax-id">Numéro fiscal</Label>
                        <Input id="tax-id" defaultValue="ES B12345678" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input id="address" defaultValue="Calle Gran Vía, 12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" defaultValue="Madrid" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal-code">Code postal</Label>
                        <Input id="postal-code" defaultValue="28013" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Input id="country" defaultValue="Espagne" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>Enregistrer</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de notifications</CardTitle>
                    <CardDescription>
                      Configurez comment vous souhaitez recevoir les notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Notifications par email</h3>
                          <p className="text-sm text-gray-500">
                            Recevoir des emails pour les mises à jour importantes
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Alertes de stock</h3>
                          <p className="text-sm text-gray-500">
                            Notifications lorsqu'un produit est en stock faible
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Mises à jour de statut des lots</h3>
                          <p className="text-sm text-gray-500">
                            Notifications lorsque le statut d'un lot change
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Rapports hebdomadaires</h3>
                          <p className="text-sm text-gray-500">
                            Recevoir un résumé hebdomadaire des activités
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité du compte</CardTitle>
                    <CardDescription>
                      Gérez la sécurité de votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Changer de mot de passe</h3>
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Mot de passe actuel</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nouveau mot de passe</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="mt-2">Mettre à jour le mot de passe</Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h3 className="text-base font-medium">Authentification à deux facteurs</h3>
                            <p className="text-sm text-gray-500">
                              Ajouter une couche de sécurité supplémentaire à votre compte
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="space-y-2">
                          <h3 className="text-base font-medium text-red-600">Zone de danger</h3>
                          <p className="text-sm text-gray-500">
                            Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Veuillez être certain.
                          </p>
                          <Button variant="destructive">Supprimer le compte</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
