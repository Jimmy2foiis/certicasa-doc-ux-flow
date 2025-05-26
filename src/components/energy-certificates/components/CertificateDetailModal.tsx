
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building2, 
  Calendar, 
  FileText, 
  Download, 
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

interface Certificate {
  id: string;
  clientName: string;
  clientEmail: string;
  thermician: string;
  submissionDate: string;
  completionDate?: string;
  status: "pending" | "processing" | "completed" | "error";
  reference: string;
}

interface CertificateDetailModalProps {
  certificate: Certificate;
  open: boolean;
  onClose: () => void;
}

const CertificateDetailModal = ({ certificate, open, onClose }: CertificateDetailModalProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "processing":
        return "En cours";
      case "completed":
        return "Terminé";
      case "error":
        return "Erreur";
      default:
        return "Inconnu";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails du Certificat {certificate.reference}</span>
            <Badge className={getStatusColor(certificate.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(certificate.status)}
                {getStatusLabel(certificate.status)}
              </span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <p className="text-sm">{certificate.clientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">{certificate.clientEmail}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Traitement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thermicien</label>
                    <p className="text-sm">{certificate.thermician}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Référence</label>
                    <p className="text-sm font-mono">{certificate.reference}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Chronologie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date d'envoi</label>
                    <p className="text-sm">{new Date(certificate.submissionDate).toLocaleDateString()}</p>
                  </div>
                  {certificate.completionDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date de finalisation</label>
                      <p className="text-sm">{new Date(certificate.completionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>État de progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Demande reçue</p>
                      <p className="text-sm text-gray-500">{new Date(certificate.submissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 ${certificate.status === "pending" ? "opacity-50" : ""}`}>
                    <div className={`h-5 w-5 rounded-full ${certificate.status !== "pending" ? "bg-green-500" : "bg-gray-300"} flex items-center justify-center`}>
                      {certificate.status !== "pending" ? (
                        <CheckCircle className="h-3 w-3 text-white" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Traitement en cours</p>
                      <p className="text-sm text-gray-500">Par {certificate.thermician}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 ${certificate.status !== "completed" ? "opacity-50" : ""}`}>
                    <div className={`h-5 w-5 rounded-full ${certificate.status === "completed" ? "bg-green-500" : "bg-gray-300"} flex items-center justify-center`}>
                      {certificate.status === "completed" ? (
                        <CheckCircle className="h-3 w-3 text-white" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Certificat généré</p>
                      {certificate.completionDate && (
                        <p className="text-sm text-gray-500">{new Date(certificate.completionDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificate.status === "completed" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Certificat énergétique</p>
                          <p className="text-sm text-gray-500">PDF - 2.1 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Rapport d'audit</p>
                          <p className="text-sm text-gray-500">PDF - 1.8 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Les documents seront disponibles une fois le certificat finalisé.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 pb-3 border-b">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Demande envoyée</p>
                      <p className="text-sm text-gray-500">{new Date(certificate.submissionDate).toLocaleDateString()} - 09:30</p>
                      <p className="text-sm text-gray-600">Certificat envoyé à {certificate.thermician}</p>
                    </div>
                  </div>
                  {certificate.status !== "pending" && (
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Traitement démarré</p>
                        <p className="text-sm text-gray-500">{new Date(certificate.submissionDate).toLocaleDateString()} - 14:15</p>
                        <p className="text-sm text-gray-600">Prise en charge par {certificate.thermician}</p>
                      </div>
                    </div>
                  )}
                  {certificate.status === "completed" && certificate.completionDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Certificat finalisé</p>
                        <p className="text-sm text-gray-500">{new Date(certificate.completionDate).toLocaleDateString()} - 16:45</p>
                        <p className="text-sm text-gray-600">Certificat disponible au téléchargement</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {certificate.status === "completed" && (
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Télécharger Certificat
            </Button>
          )}
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Renvoyer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDetailModal;
