
import { 
  ArrowLeft, 
  Building, 
  FileSignature, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  FileText,
  Calendar,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { clientsData, clientDocuments } from "@/data/mock";
import { useState } from "react";
import ProjectCalculation from "../calculations/ProjectCalculation";

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetails = ({ clientId, onBack }: ClientDetailsProps) => {
  const client = clientsData.find(c => c.id === clientId);
  const [showCalculations, setShowCalculations] = useState(false);
  
  if (!client) return null;

  if (showCalculations) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => setShowCalculations(false)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-xl font-semibold">Cálculos para proyecto de {client.name}</h2>
        </div>
        <ProjectCalculation clientId={clientId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-2xl font-semibold">Ficha de Cliente</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Editar</Button>
          <Button className="bg-green-600 hover:bg-green-700">Nuevo Proyecto</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Información Personal</CardTitle>
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
                    {client.status}
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
                <div className="flex">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                  <span>Calle Serrano 120, 28006 Madrid</span>
                </div>
                <div className="flex">
                  <Building className="h-5 w-5 text-gray-500 mr-3" />
                  <span>NIF: {client.nif || "X-1234567-Z"}</span>
                </div>
                <div className="flex">
                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  <span>Tipo: RES{client.type || "010"}</span>
                </div>
                <div className="flex">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <span>Alta: 14/04/2023</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="projects">
            <TabsList className="w-full">
              <TabsTrigger value="projects" className="flex-1">Proyectos</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">Documentos</TabsTrigger>
              <TabsTrigger value="signatures" className="flex-1">Firmas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos del cliente</CardTitle>
                  <CardDescription>
                    Proyectos asociados a {client.name}
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
                                <h4 className="font-medium">Rehabilitación Energética #{project}</h4>
                                <p className="text-sm text-gray-500">RES020 - Aislamiento Fachada</p>
                              </div>
                            </div>
                            <Badge variant="success">En progreso</Badge>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-3 text-sm">
                            <div>
                              <p className="text-gray-500">Superficie</p>
                              <p className="font-medium">127 m²</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Creado</p>
                              <p className="font-medium">12/05/2023</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Finaliza</p>
                              <p className="font-medium">28/07/2023</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">Ver detalles</Button>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => setShowCalculations(true)}
                            >
                              Cálculos
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>
                    Documentos generados para los proyectos del cliente
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
                            <p className="text-sm text-gray-500">Proyecto: {doc.project}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            doc.status === "Generado" ? "default" :
                            doc.status === "Firmado" ? "success" :
                            "outline"
                          }>
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Ver
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
                  <CardTitle>Firmas Recolectadas</CardTitle>
                  <CardDescription>
                    Firmas obtenidas para documentos y contratos
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
                            <h4 className="font-medium">Contrato de obra #{signature}</h4>
                            <p className="text-sm text-gray-500">Firmado: 15/05/2023</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver firma
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
    </div>
  );
};

export default ClientDetails;
