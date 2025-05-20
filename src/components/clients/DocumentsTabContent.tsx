
import { useState } from "react";
import { FileText, Download, Eye, Search, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { clientDocuments } from "@/data/mock";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface DocumentsTabContentProps {
  clientId?: string;
}

const DocumentsTabContent = ({ clientId }: DocumentsTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
  const filteredDocuments = clientDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Generado": return "default";
      case "Firmado": return "success";
      case "Pendiente": return "outline";
      default: return "outline";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "Generado": return "Généré";
      case "Firmado": return "Signé";
      case "Pendiente": return "En attente";
      default: return status;
    }
  };

  const documentsByType = {
    total: filteredDocuments.length,
    signed: filteredDocuments.filter(doc => doc.status === "Firmado").length,
    generated: filteredDocuments.filter(doc => doc.status === "Generado").length,
    pending: filteredDocuments.filter(doc => doc.status === "Pendiente").length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Documents générés pour les projets du client
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Nouveau document
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="cursor-pointer">
            Tous ({documentsByType.total})
          </Badge>
          <Badge variant="success" className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200">
            Signés ({documentsByType.signed})
          </Badge>
          <Badge variant="default" className="cursor-pointer">
            Générés ({documentsByType.generated})
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            En attente ({documentsByType.pending})
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              {searchTerm ? "Aucun document correspondant à votre recherche" : "Aucun document disponible pour ce client"}
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    id={`doc-${doc.id}`}
                    className="mr-3"
                  />
                  <FileText className={`h-5 w-5 ${doc.status === "Firmado" ? "text-green-500" : "text-blue-500"} mr-3`} />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-500">Projet: {doc.project}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(doc.status)}>
                    {translateStatus(doc.status)}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" /> Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Télécharger
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-gray-500">
          {selectedDocuments.length > 0 ? (
            `${selectedDocuments.length} document(s) sélectionné(s)`
          ) : (
            `${filteredDocuments.length} document(s) au total`
          )}
        </div>
        {selectedDocuments.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Télécharger la sélection
            </Button>
            <Button variant="default" size="sm">
              Action groupée
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentsTabContent;
