
import { useState } from "react";
import { FileSignature, Eye, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface SignatureItem {
  id: string;
  documentName: string;
  signedDate: string;
  status: "signed" | "pending" | "expired";
}

// Mock data for signatures
const mockSignatures: SignatureItem[] = [
  {
    id: "1",
    documentName: "Contrat de travaux #1",
    signedDate: "15/05/2023",
    status: "signed"
  },
  {
    id: "2",
    documentName: "Attestation de fin de travaux",
    signedDate: "21/06/2023",
    status: "signed"
  },
  {
    id: "3",
    documentName: "Autorisation de paiement",
    signedDate: "",
    status: "pending"
  },
  {
    id: "4",
    documentName: "Certificat de conformité",
    signedDate: "",
    status: "pending"
  }
];

interface SignaturesTabContentProps {
  clientId?: string;
}

const SignaturesTabContent = ({ clientId }: SignaturesTabContentProps) => {
  const [signatures, setSignatures] = useState<SignatureItem[]>(mockSignatures);
  const [selectedSignatures, setSelectedSignatures] = useState<string[]>([]);

  const toggleSignatureSelection = (signatureId: string) => {
    setSelectedSignatures(prev => 
      prev.includes(signatureId)
        ? prev.filter(id => id !== signatureId)
        : [...prev, signatureId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge variant="success" className="bg-green-500">Signé</Badge>;
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      case "expired":
        return <Badge variant="destructive">Expiré</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Signatures Collectées</CardTitle>
          <CardDescription>
            Signatures obtenues pour documents et contrats
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {selectedSignatures.length > 0 && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Exporter ({selectedSignatures.length})
            </Button>
          )}
          <Button variant="default" size="sm">
            <FileSignature className="h-4 w-4 mr-1" /> Créer une demande
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {signatures.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Aucune signature trouvée pour ce client
            </div>
          ) : (
            signatures.map((signature) => (
              <div 
                key={signature.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedSignatures.includes(signature.id)}
                    onCheckedChange={() => toggleSignatureSelection(signature.id)}
                    id={`signature-${signature.id}`}
                  />
                  <FileSignature className={`h-5 w-5 ${signature.status === "signed" ? "text-green-500" : "text-gray-400"} mr-1`} />
                  <div>
                    <h4 className="font-medium">{signature.documentName}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      {signature.signedDate ? (
                        <>
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>Signé le: {signature.signedDate}</span>
                        </>
                      ) : (
                        <span>En attente de signature</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(signature.status)}
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" /> Voir
                  </Button>
                  {signature.status === "signed" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Télécharger
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-5">
        <div className="text-sm text-gray-500">
          {signatures.filter(s => s.status === "signed").length} signatures sur {signatures.length} documents
        </div>
        {signatures.some(s => s.status === "pending") && (
          <Button variant="outline" size="sm">
            Envoyer un rappel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SignaturesTabContent;
