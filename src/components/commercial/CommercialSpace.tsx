import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, UserCheck, Clipboard, Calendar, User, Clock, GanttChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CommercialSidebar from "./CommercialSidebar";

const CommercialSpace = () => {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <div className="h-full flex">
      {/* Arborescence latérale */}
      <CommercialSidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Espace Commercial / Terrain</h1>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <UserCheck className="mr-2 h-4 w-4" /> Nouveau Lead
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
            <TabsTrigger value="pipeline" className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>Pipeline Commercial</span>
            </TabsTrigger>
            <TabsTrigger value="qualification" className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              <span>Qualification</span>
            </TabsTrigger>
            <TabsTrigger value="visits" className="flex items-center gap-1">
              <Clipboard className="h-4 w-4" />
              <span>Visites Techniques</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Planning</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Clients</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
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
          </TabsContent>

          <TabsContent value="qualification">
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
          </TabsContent>

          <TabsContent value="visits">
            <div className="p-6 bg-white rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Visites Techniques</h2>
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
          </TabsContent>

          <TabsContent value="planning">
            <div className="p-6 bg-white rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Planning des Interventions</h2>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" /> Jour
                  </Button>
                  <Button variant="outline" className="bg-blue-50">
                    <GanttChart className="mr-2 h-4 w-4" /> Semaine
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" /> Mois
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-7 border-b">
                  <div className="p-2 text-center font-medium border-r">Lun 19/05</div>
                  <div className="p-2 text-center font-medium border-r">Mar 20/05</div>
                  <div className="p-2 text-center font-medium border-r bg-blue-50">Mer 21/05</div>
                  <div className="p-2 text-center font-medium border-r">Jeu 22/05</div>
                  <div className="p-2 text-center font-medium border-r">Ven 23/05</div>
                  <div className="p-2 text-center font-medium border-r bg-gray-100">Sam 24/05</div>
                  <div className="p-2 text-center font-medium bg-gray-100">Dim 25/05</div>
                </div>
                
                <div className="grid grid-cols-7 min-h-[300px]">
                  <div className="border-r relative p-2">
                    <div className="absolute top-2 left-2 right-2 bg-green-100 border border-green-200 rounded p-2 h-20">
                      <div className="text-xs font-semibold">Équipe A</div>
                      <div className="text-xs">Dupont Marc</div>
                      <div className="text-xs text-gray-500">09:00 - 12:00</div>
                    </div>
                    <div className="absolute top-24 left-2 right-2 bg-blue-100 border border-blue-200 rounded p-2 h-20">
                      <div className="text-xs font-semibold">Équipe B</div>
                      <div className="text-xs">Simon Léa</div>
                      <div className="text-xs text-gray-500">14:00 - 17:00</div>
                    </div>
                  </div>
                  <div className="border-r p-2">
                    <div className="absolute top-2 left-2 right-2 bg-purple-100 border border-purple-200 rounded p-2 h-20">
                      <div className="text-xs font-semibold">Équipe C</div>
                      <div className="text-xs">Bertrand Charles</div>
                      <div className="text-xs text-gray-500">10:00 - 13:00</div>
                    </div>
                  </div>
                  <div className="border-r p-2 bg-blue-50">
                    <div className="absolute top-2 left-2 right-2 bg-amber-100 border border-amber-200 rounded p-2 h-20">
                      <div className="text-xs font-semibold">Équipe A</div>
                      <div className="text-xs">Martin Sophie</div>
                      <div className="text-xs text-gray-500">09:30 - 12:30</div>
                    </div>
                  </div>
                  <div className="border-r p-2">
                    <div className="absolute top-2 left-2 right-2 bg-blue-100 border border-blue-200 rounded p-2 h-20">
                      <div className="text-xs font-semibold">Équipe B</div>
                      <div className="text-xs">Roche Antoine</div>
                      <div className="text-xs text-gray-500">10:30 - 13:30</div>
                    </div>
                  </div>
                  <div className="border-r p-2"></div>
                  <div className="border-r p-2 bg-gray-100"></div>
                  <div className="p-2 bg-gray-100"></div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Équipe A</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-xs text-gray-500">3 interventions cette semaine</div>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Équipe B</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-xs text-gray-500">2 interventions cette semaine</div>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Équipe C</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-xs text-gray-500">1 intervention cette semaine</div>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crm">
            <div className="p-6 bg-white rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Gestion des Clients (CRM)</h2>
              
              <div className="flex flex-col gap-4">
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière action</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: 'Dupont Marc', status: 'Lead', date: '15/05/2025', lastAction: 'Email envoyé (20/05)' },
                        { name: 'Martin Sophie', status: 'Qualification', date: '10/05/2025', lastAction: 'Appel (19/05)' },
                        { name: 'Bernard Jean', status: 'Lead', date: '18/05/2025', lastAction: 'Création' },
                        { name: 'Moreau Claude', status: 'Confirmé', date: '02/05/2025', lastAction: 'Devis signé (15/05)' },
                        { name: 'Petit Christine', status: 'Confirmé', date: '05/05/2025', lastAction: 'Visite programmée (18/05)' }
                      ].map((client, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className={
                              client.status === 'Lead' ? 'bg-blue-100 text-blue-800' :
                              client.status === 'Qualification' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {client.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.lastAction}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-900">
                              Voir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Affichage de 5 clients sur 24</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                    <Button variant="outline" size="sm" className="bg-blue-50">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">Suivant</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommercialSpace;
