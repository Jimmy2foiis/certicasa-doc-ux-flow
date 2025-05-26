
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Send, User, Building2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ClientSearchSelector from "./components/ClientSearchSelector";
import ThermicianSelector from "./components/ThermicianSelector";
import ClientDataPreview from "./components/ClientDataPreview";

const SendPage = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedThermician, setSelectedThermician] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendCertificate = async () => {
    if (!selectedClient || !selectedThermician) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner un client et un thermicien",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Certificat envoyé",
        description: `Le certificat énergétique a été envoyé avec succès pour ${selectedClient.name}`,
      });
      
      // Reset form
      setSelectedClient(null);
      setSelectedThermician("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du certificat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Sélection du Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientSearchSelector
              selectedClient={selectedClient}
              onClientSelect={setSelectedClient}
            />
          </CardContent>
        </Card>

        {/* Thermician Selection */}
        <Card>
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
            />
          </CardContent>
        </Card>
      </div>

      {/* Client Data Preview */}
      {selectedClient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Aperçu des Données Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientDataPreview client={selectedClient} />
          </CardContent>
        </Card>
      )}

      {/* Send Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSendCertificate}
          disabled={!selectedClient || !selectedThermician || isLoading}
          className="bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <Send className="h-5 w-5 mr-2" />
          {isLoading ? "Envoi en cours..." : "Envoyer le Certificat"}
        </Button>
      </div>
    </div>
  );
};

export default SendPage;
