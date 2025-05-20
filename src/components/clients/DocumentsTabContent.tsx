
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { clientDocuments } from "@/data/mock";

const DocumentsTabContent = () => {
  return (
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
  );
};

export default DocumentsTabContent;
