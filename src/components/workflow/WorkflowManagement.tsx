
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  Calculator,
  FileCheck,
  Upload,
  Boxes,
  ArrowRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WorkflowManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Flujo de Trabajo de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <div className="absolute left-5 top-0 bottom-0 w-1 bg-gray-200 z-0"></div>
            
            <div className="relative z-10 flex mb-8">
              <div className="flex flex-col items-center mr-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="w-1 h-full bg-green-500"></div>
              </div>
              
              <div className="bg-white border rounded-md p-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="font-medium">Cliente creado</h3>
                    <Badge variant="success" className="ml-2">Completado</Badge>
                  </div>
                  <span className="text-sm text-gray-500">14/04/2023</span>
                </div>
                <p className="text-sm text-gray-600">Datos personales y del inmueble registrados correctamente.</p>
              </div>
            </div>
            
            <div className="relative z-10 flex mb-8">
              <div className="flex flex-col items-center mr-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="w-1 h-full bg-green-500"></div>
              </div>
              
              <div className="bg-white border rounded-md p-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="font-medium">Inspección planificada</h3>
                    <Badge variant="success" className="ml-2">Completado</Badge>
                  </div>
                  <span className="text-sm text-gray-500">18/04/2023</span>
                </div>
                <p className="text-sm text-gray-600">El técnico ha visitado la vivienda y tomado las medidas correspondientes.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Fecha: 16/04/2023
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50">
                    <Boxes className="h-3.5 w-3.5 mr-1" />
                    Superficie: 127 m²
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 flex mb-8">
              <div className="flex flex-col items-center mr-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                  <Calculator className="h-5 w-5" />
                </div>
                <div className="w-1 h-full bg-gray-200"></div>
              </div>
              
              <div className="bg-white border border-blue-200 rounded-md p-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="font-medium text-blue-700">Cálculos realizados</h3>
                    <Badge className="ml-2">En proceso</Badge>
                  </div>
                  <span className="text-sm text-gray-500">Actual</span>
                </div>
                <p className="text-sm text-gray-600">Los cálculos de resistencia térmica muestran una mejora del 43%.</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Ui: 1.76 W/m²K
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Uf: 0.38 W/m²K
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <ArrowRight className="h-3.5 w-3.5 mr-1" />
                    Mejora: 78%
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Finalizar cálculos
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 flex mb-8">
              <div className="flex flex-col items-center mr-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div className="w-1 h-full bg-gray-200"></div>
              </div>
              
              <div className="bg-white border border-dashed rounded-md p-4 flex-1 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="font-medium">Documentos generados</h3>
                    <Badge variant="outline" className="ml-2">Pendiente</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">3 de 8 documentos listos para generación.</p>
                <div className="mt-3 text-sm text-amber-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Faltan datos de cálculo para completar documentos.</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 flex mb-1">
              <div className="flex flex-col items-center mr-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white">
                  <Upload className="h-5 w-5" />
                </div>
              </div>
              
              <div className="bg-white border border-dashed rounded-md p-4 flex-1 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="font-medium">Documentación exportada</h3>
                    <Badge variant="outline" className="ml-2">Pendiente</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">La documentación final será exportada para su envío a MITECO.</p>
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="alertas">
              <AccordionTrigger className="py-3 bg-amber-50 px-4 rounded-t-md border border-amber-200 text-amber-800">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Alertas del proyecto (3)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border border-t-0 border-amber-200 rounded-b-md p-4 bg-white">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Falta firma en documento</p>
                      <p className="text-sm text-gray-600">El documento "Certificado de Actuación" requiere la firma del técnico.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Datos de superficie incompletos</p>
                      <p className="text-sm text-gray-600">La superficie de intervención debe ser desglosada por orientaciones.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Falta DNI del cliente</p>
                      <p className="text-sm text-gray-600">Es necesario subir una copia del DNI del cliente para completar el expediente.</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="h-4 w-4 mr-1" />
                        Subir DNI
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowManagement;
