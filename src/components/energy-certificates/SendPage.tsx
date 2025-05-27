
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Send, 
  Building2, 
  Filter, 
  ChevronDown,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCertificateQueue, CertificateQueueItem } from "@/hooks/useCertificateQueue";
import ThermicianSelector from "./components/ThermicianSelector";

const SendPage = () => {
  const [certificates, setCertificates] = useState<CertificateQueueItem[]>([]);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [selectedThermician, setSelectedThermician] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { getQueue, removeFromQueue } = useCertificateQueue();

  // Load certificates on mount
  useEffect(() => {
    const loadedCertificates = getQueue();
    setCertificates(loadedCertificates);
  }, [getQueue]);

  // Filter certificates based on status
  const filteredCertificates = certificates.filter(cert => {
    if (statusFilter === "all") return cert.status === "pending";
    if (statusFilter === "urgent") return cert.status === "pending" && cert.isUrgent;
    return cert.status === statusFilter;
  });

  const pendingCount = certificates.filter(c => c.status === "pending").length;
  const selectedCount = selectedCertificates.length;
  const allSelected = filteredCertificates.length > 0 && selectedCertificates.length === filteredCertificates.length;
  const someSelected = selectedCertificates.length > 0 && selectedCertificates.length < filteredCertificates.length;

  // Handle select all toggle
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(filteredCertificates.map(cert => cert.id));
    }
  };

  // Handle individual certificate selection
  const handleCertificateSelect = (certificateId: string) => {
    setSelectedCertificates(prev => 
      prev.includes(certificateId)
        ? prev.filter(id => id !== certificateId)
        : [...prev, certificateId]
    );
  };

  // Get energy class color
  const getEnergyClassColor = (energyClass: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-500 text-white',
      'B': 'bg-green-400 text-white',
      'C': 'bg-yellow-400 text-black',
      'D': 'bg-orange-400 text-white',
      'E': 'bg-red-400 text-white',
      'F': 'bg-red-500 text-white',
      'G': 'bg-red-600 text-white'
    };
    return colors[energyClass] || 'bg-gray-400 text-white';
  };

  // Calculate total estimated amount
  const totalAmount = selectedCertificates.reduce((sum, certId) => {
    const cert = certificates.find(c => c.id === certId);
    return sum + (cert?.estimatedAmount || 0);
  }, 0);

  // Handle send certificates
  const handleSendCertificates = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove sent certificates from queue
      removeFromQueue(selectedCertificates);
      
      // Update local state
      setCertificates(prev => prev.filter(cert => !selectedCertificates.includes(cert.id)));
      setSelectedCertificates([]);
      setShowConfirmModal(false);
      
      toast({
        title: "Certificats envoyés",
        description: `${selectedCount} certificat(s) ont été envoyés avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi des certificats",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (selectedCount === 0) return "Sélectionnez des certificats";
    if (!selectedThermician) return "Choisissez un thermicien";
    return `Envoyer ${selectedCount} certificat(s)`;
  };

  const canSend = selectedCount > 0 && selectedThermician;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificates List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Certificats en attente</span>
              <Badge variant="secondary">{pendingCount} certificat(s)</Badge>
            </CardTitle>
            
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  className="data-[state=checked]:bg-green-600"
                />
                <span className="text-sm text-gray-600">
                  {selectedCount}/{filteredCertificates.length} sélectionnés
                </span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === "all" ? "Tous" : statusFilter === "urgent" ? "Urgent" : "En attente"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    Tous
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("urgent")}>
                    Urgent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredCertificates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun certificat en attente
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Surface</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((certificate) => (
                      <TableRow 
                        key={certificate.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCertificateSelect(certificate.id)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedCertificates.includes(certificate.id)}
                            onCheckedChange={() => handleCertificateSelect(certificate.id)}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {certificate.reference}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{certificate.clientName}</p>
                            <p className="text-xs text-gray-500">{certificate.clientEmail}</p>
                            {certificate.clientPhone && (
                              <p className="text-xs text-gray-500">{certificate.clientPhone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{certificate.projectType}</p>
                            <p className="text-xs text-gray-500">{certificate.surfaceArea}m²</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${getEnergyClassColor(certificate.energyClass || 'C')}`}
                          >
                            {certificate.energyClass || 'C'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{certificate.estimatedAmount?.toLocaleString()}€</span>
                        </TableCell>
                        <TableCell>
                          {certificate.isUrgent && (
                            <Badge className="bg-red-100 text-red-700">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thermician Selection */}
        <Card className={selectedCount === 0 ? "opacity-50" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Thermicien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThermicianSelector
              selectedThermician={selectedThermician}
              onThermicianSelect={setSelectedThermician}
              disabled={selectedCount === 0}
            />
          </CardContent>
        </Card>
      </div>

      {/* Summary and Send Button */}
      {selectedCount > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Résumé :</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• {selectedCount} certificat(s) sélectionné(s)</li>
                  <li>• Thermicien : {selectedThermician || "Non sélectionné"}</li>
                  <li>• Montant total : {totalAmount.toLocaleString()} €</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!canSend}
                  className={canSend ? "bg-green-600 hover:bg-green-700" : ""}
                  size="lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {getButtonText()}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirmer l'envoi des certificats</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'envoyer {selectedCount} certificat(s) au thermicien sélectionné.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Certificats à envoyer :</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {selectedCertificates.map(certId => {
                  const cert = certificates.find(c => c.id === certId);
                  return cert ? (
                    <div key={certId} className="text-sm bg-gray-50 p-2 rounded">
                      {cert.reference} - {cert.clientName}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium">Thermicien destinataire :</h4>
              <p className="text-sm text-gray-600">{selectedThermician}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Montant total :</h4>
              <p className="text-lg font-bold text-green-600">{totalAmount.toLocaleString()} €</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSendCertificates} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Envoi en cours..." : "Confirmer l'envoi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendPage;
