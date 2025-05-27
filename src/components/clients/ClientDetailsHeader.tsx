import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Eye, Edit, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Client } from "@/services/api/types";
import AddToQueueButton from "@/components/energy-certificates/components/AddToQueueButton";

interface ClientDetailsHeaderProps {
  client: Client;
  clientId: string;
  clientName: string;
  onBack: () => void;
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
  onDocumentGenerated?: (documentId: string) => void;
  onClientUpdated?: () => void;
}

const ClientDetailsHeader = ({ 
  client, 
  clientId, 
  clientName, 
  onBack, 
  documentStats, 
  onViewMissingDocs, 
  onDocumentGenerated, 
  onClientUpdated 
}: ClientDetailsHeaderProps) => {
  const navigate = useNavigate();

  const handleEditClient = () => {
    // Logic to navigate to edit client page
    console.log("Editing client:", clientId);
  };

  const handleViewDocuments = () => {
    // Logic to navigate to documents tab
    console.log("Viewing documents for client:", clientId);
  };

  return (
    <div className="bg-white border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{clientName}</h1>
            <p className="text-sm text-gray-500">ID du client: {clientId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Documents */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3 text-center">
                Documents
              </h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total</span>
                <span>{documentStats?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Générés</span>
                <span>{documentStats?.generated || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Manquants</span>
                <span>{documentStats?.missing || 0}</span>
              </div>
              {documentStats?.error && (
                <div className="flex items-center justify-between text-sm text-red-600">
                  <span>Erreur</span>
                  <span>{documentStats.error}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={onViewMissingDocs}
              >
                Voir les documents manquants
              </Button>
            </div>
          </div>

          {/* Colonne du milieu - Actions rapides */}
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3 text-center">
                Actions Rapides
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClient}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDocuments}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Documents
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Ajouter un projet")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Ajouter un projet
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Envoyer un email")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Envoyer un email
                </Button>
              </div>
            </div>
          </div>

          {/* Actions - Colonne droite */}
          <div className="space-y-4">
            {/* Nouveau bouton pour ajouter à la file CEE */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-3 text-center">
                Certificat Énergétique
              </h4>
              <AddToQueueButton client={client} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsHeader;
