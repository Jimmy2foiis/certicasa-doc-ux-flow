
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Eye,
  Upload,
  CheckCircle2,
  Clock,
  FilePen,
  Share2,
} from "lucide-react";
import { documentTypes } from "@/data/mock";
import { Progress } from "@/components/ui/progress";

const DocumentGeneration = () => {
  const [selectedClient, setSelectedClient] = useState("Juan Pérez");
  const [selectedProject, setSelectedProject] = useState("Rehabilitación energética fachada");
  
  const documentProgress = documentTypes.reduce((acc, doc) => {
    if (doc.status === "Generado" || doc.status === "Firmado" || doc.status === "Exportado") {
      return acc + 1;
    }
    return acc;
  }, 0);
  
  const progressPercentage = (documentProgress / documentTypes.length) * 100;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Generación de Documentos</CardTitle>
            <CardDescription>Gestión documental para proyectos RES</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Cliente seleccionado</h3>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedClient}</p>
                <p className="text-sm text-gray-500">NIF: X-1234567-Z</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Proyecto seleccionado</h3>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedProject}</p>
                <p className="text-sm text-gray-500">RES010 • 127m²</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Progreso documental</h3>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>{documentProgress} de {documentTypes.length} completados</span>
                  <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col gap-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Generar todos los documentos
              </Button>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Subir documentos externos
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar todo en ZIP
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Lista de Documentos Requeridos</CardTitle>
            <CardDescription>
              Documentos necesarios para completar el expediente RES
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentTypes.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {doc.status === "Pendiente" ? (
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        ) : doc.status === "Generado" ? (
                          <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        ) : doc.status === "Firmado" ? (
                          <FilePen className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                        )}
                        <span>{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{doc.description}</TableCell>
                    <TableCell>
                      <Badge variant={
                        doc.status === "Pendiente" ? "outline" :
                        doc.status === "Generado" ? "default" :
                        doc.status === "Firmado" ? "success" : 
                        "success"
                      }>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {doc.status === "Pendiente" ? (
                          <Button size="sm" variant="ghost">
                            Generar
                          </Button>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {doc.status !== "Exportado" && (
                              <Button size="sm" variant="ghost" className="text-green-600">
                                {doc.status === "Generado" ? "Firmar" : "Exportar"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentGeneration;
