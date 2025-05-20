
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  FileText,
  Calendar,
  MapPinned, 
  FileSpreadsheet,
  Home,
  FileSignature,
  Calculator
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { clientDocuments } from "@/data/mock";
import { useState } from "react";
import AddressSearch from "./AddressSearch";

interface ClientInfoTabProps {
  client: any;
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  loadingCadastral: boolean;
  onShowCalculation?: (projectId?: string) => void;
  onAddressChange?: (newAddress: string) => void;
}

const ClientInfoTab = ({ 
  client, 
  utmCoordinates, 
  cadastralReference, 
  climateZone,
  loadingCadastral,
  onShowCalculation,
  onAddressChange
}: ClientInfoTabProps) => {
  // Adresse par défaut du client
  const [address, setAddress] = useState(client.address || "Rue Serrano 120, 28006 Madrid");
  
  // Gestionnaire de changement d'adresse
  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    // Propager le changement d'adresse au composant parent pour mettre à jour les données cadastrales
    if (onAddressChange) {
      onAddressChange(newAddress);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <User className="h-10 w-10" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">{client.name}</h3>
                <Badge variant={client.status === "Activo" ? "success" : "outline"}>
                  {client.status === "Activo" ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <span>{client.email}</span>
              </div>
              <div className="flex">
                <Phone className="h-5 w-5 text-gray-500 mr-3" />
                <span>{client.phone}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <AddressSearch 
                  initialAddress={address} 
                  onAddressChange={handleAddressChange} 
                />
              </div>
              
              {/* Informations cadastrales */}
              <div className="space-y-2 mt-4 border-t pt-4">
                <div className="flex">
                  <MapPinned className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">UTM30:</p>
                    <span>{loadingCadastral ? "Chargement..." : utmCoordinates}</span>
                  </div>
                </div>
                
                <div className="flex">
                  <FileSpreadsheet className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Référence cadastrale:</p>
                    <span>{loadingCadastral ? "Chargement..." : cadastralReference}</span>
                  </div>
                </div>
                
                <div className="flex">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Zone climatique:</p>
                    <span>{loadingCadastral ? "Chargement..." : climateZone}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <Building className="h-5 w-5 text-gray-500 mr-3" />
                <span>NIF: {client.nif || "X-1234567-Z"}</span>
              </div>
              <div className="flex">
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <span>Type: RES{client.type || "010"}</span>
              </div>
              <div className="flex">
                <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                <span>Inscription: 14/04/2023</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Tabs defaultValue="projects">
          <TabsList className="w-full">
            <TabsTrigger value="projects" className="flex-1">Projets</TabsTrigger>
            <TabsTrigger value="calculations" className="flex-1">Calculs</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="signatures" className="flex-1">Signatures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Projets du client</CardTitle>
                <CardDescription>
                  Projets associés à {client.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((project) => (
                    <Card key={project}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                              <Home className="h-6 w-6" />
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium">Réhabilitation Énergétique #{project}</h4>
                              <p className="text-sm text-gray-500">RES020 - Isolation Façade</p>
                            </div>
                          </div>
                          <Badge variant="success">En cours</Badge>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 text-sm">
                          <div>
                            <p className="text-gray-500">Surface</p>
                            <p className="font-medium">127 m²</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Créé le</p>
                            <p className="font-medium">12/05/2023</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Fin prévue</p>
                            <p className="font-medium">28/07/2023</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">Voir détails</Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => onShowCalculation && onShowCalculation(`project_${project}`)}
                          >
                            Calculs
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Calculs énergétiques</CardTitle>
                <CardDescription>
                  Calculs et simulations énergétiques pour ce client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((calc) => (
                    <Card key={calc}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center text-green-600">
                              <Calculator className="h-6 w-6" />
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium">Calcul énergétique #{calc}</h4>
                              <p className="text-sm text-gray-500">Projet: Réhabilitation Énergétique #{calc}</p>
                            </div>
                          </div>
                          <Badge variant="outline">Complété</Badge>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 text-sm">
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium">Thermique</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">18/05/2023</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amélioration</p>
                            <p className="font-medium">{35 + calc * 5}%</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">Télécharger PDF</Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => onShowCalculation && onShowCalculation(`project_${calc}`)}
                          >
                            Voir détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                  <Card className="border-dashed border-2">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Calculator className="h-12 w-12 text-gray-400 mb-3 mt-3" />
                      <h4 className="font-medium mb-2">Nouveau calcul</h4>
                      <p className="text-sm text-gray-500 text-center mb-4">
                        Créer un nouveau calcul énergétique pour ce client
                      </p>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onShowCalculation && onShowCalculation()}
                      >
                        Créer un calcul
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Documents générés pour les projets du client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientDocuments.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-500">Projet: {doc.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          doc.status === "Generado" ? "default" :
                          doc.status === "Firmado" ? "success" :
                          "outline"
                        }>
                          {doc.status === "Generado" ? "Généré" : 
                           doc.status === "Firmado" ? "Signé" : doc.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signatures" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Signatures Collectées</CardTitle>
                <CardDescription>
                  Signatures obtenues pour documents et contrats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((signature) => (
                    <div 
                      key={signature} 
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <FileSignature className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Contrat de travaux #{signature}</h4>
                          <p className="text-sm text-gray-500">Signé le: 15/05/2023</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Voir signature
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientInfoTab;
