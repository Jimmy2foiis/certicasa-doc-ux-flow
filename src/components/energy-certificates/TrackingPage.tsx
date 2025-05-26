
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Download, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CertificateDetailModal from "./components/CertificateDetailModal";

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

const mockCertificates: Certificate[] = [
  {
    id: "1",
    clientName: "García López, María",
    clientEmail: "maria.garcia@email.com",
    thermician: "Tramitting",
    submissionDate: "2024-01-15",
    completionDate: "2024-01-17",
    status: "completed",
    reference: "CEE-2024-001",
  },
  {
    id: "2",
    clientName: "Martínez Rodríguez, Juan",
    clientEmail: "juan.martinez@email.com",
    thermician: "CertiPro",
    submissionDate: "2024-01-16",
    status: "processing",
    reference: "CEE-2024-002",
  },
  {
    id: "3",
    clientName: "López Fernández, Ana",
    clientEmail: "ana.lopez@email.com",
    thermician: "EnergieCert",
    submissionDate: "2024-01-16",
    status: "pending",
    reference: "CEE-2024-003",
  },
  {
    id: "4",
    clientName: "Ruiz Sánchez, Pedro",
    clientEmail: "pedro.ruiz@email.com",
    thermician: "Tramitting",
    submissionDate: "2024-01-14",
    status: "error",
    reference: "CEE-2024-004",
  },
];

const TrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { toast } = useToast();

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

  const filteredCertificates = mockCertificates.filter(cert => {
    const matchesSearch = cert.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statsData = [
    {
      title: "En attente",
      count: mockCertificates.filter(c => c.status === "pending").length,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "En cours",
      count: mockCertificates.filter(c => c.status === "processing").length,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Terminés",
      count: mockCertificates.filter(c => c.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Erreurs",
      count: mockCertificates.filter(c => c.status === "error").length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const handleDownload = (certificate: Certificate) => {
    toast({
      title: "Téléchargement démarré",
      description: `Le certificat ${certificate.reference} va être téléchargé`,
    });
  };

  const handleResend = (certificate: Certificate) => {
    toast({
      title: "Certificat renvoyé",
      description: `Le certificat ${certificate.reference} a été renvoyé`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi des Certificats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email ou référence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  <Filter className="h-4 w-4 mr-2" />
                  Statut: {statusFilter === "all" ? "Tous" : getStatusLabel(statusFilter)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Tous
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  En attente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("processing")}>
                  En cours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Terminés
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("error")}>
                  Erreurs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Certificates Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Thermicien</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date d'envoi</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{certificate.clientName}</p>
                        <p className="text-sm text-gray-500">{certificate.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{certificate.thermician}</TableCell>
                    <TableCell className="font-mono text-sm">{certificate.reference}</TableCell>
                    <TableCell>{new Date(certificate.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(certificate.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(certificate.status)}
                          {getStatusLabel(certificate.status)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedCertificate(certificate)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          {certificate.status === "completed" && (
                            <DropdownMenuItem onClick={() => handleDownload(certificate)}>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleResend(certificate)}>
                            <Send className="h-4 w-4 mr-2" />
                            Renvoyer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <CertificateDetailModal
          certificate={selectedCertificate}
          open={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default TrackingPage;
