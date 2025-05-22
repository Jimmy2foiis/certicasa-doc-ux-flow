
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import ClientDetailsHeader from "./ClientDetailsHeader";
import { ClientTabsContainer } from "./ClientTabsContainer";
import CalculationHandler from "./CalculationHandler";
import { useClientDetails } from "@/hooks/useClientDetails";

interface ClientDetailsViewProps {
  clientId: string;
  onBack: () => void;
  onClientUpdated?: () => void;
}

const ClientDetailsView = ({ clientId, onBack, onClientUpdated }: ClientDetailsViewProps) => {
  const { client, loading, error } = useClientDetails(clientId);
  const [showCalculation, setShowCalculation] = useState(false);
  const [activeCalculationProject, setActiveCalculationProject] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  // Use useEffect to show error toasts instead of doing it in render
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les détails du client: ${error}`,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [error, toast]);

  const handleShowCalculation = (projectId?: string) => {
    setActiveCalculationProject(projectId);
    setShowCalculation(true);
  };

  const handleBackFromCalculation = () => {
    setShowCalculation(false);
    setActiveCalculationProject(undefined);
  };
  
  // Construire une adresse complète à partir des données du client
  const clientAddress = client ? 
    `${client.adresse}, ${client.codePostal} ${client.ville}, ${client.pays}` : 
    "";

  // Remplacer par l'écran de chargement si les données sont en cours de chargement
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-16 w-full mb-6" />
        <Skeleton className="h-[500px] w-full" />
      </Card>
    );
  }

  if (!client) {
    return (
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">Client non trouvé</h2>
        </div>
        <p className="text-gray-500">Ce client n'existe pas ou a été supprimé.</p>
        <Button onClick={onBack} className="mt-4">Retour à la liste des clients</Button>
      </Card>
    );
  }

  // Préparer les données du client pour l'affichage
  const clientDisplayData = {
    id: client.id,
    name: `${client.prenom} ${client.nom}`,
    email: client.email || "",
    phone: client.tel || "",
    address: clientAddress,
    nif: client.cadastralReference || "",
    status: client.status
  };

  return (
    <div>
      {showCalculation ? (
        <CalculationHandler
          onBack={handleBackFromCalculation}
          projectId={activeCalculationProject}
          clientId={clientId}
          clientName={`${client.prenom} ${client.nom}`}
          clientAddress={clientAddress}
        />
      ) : (
        <>
          <ClientDetailsHeader 
            onBack={onBack} 
            client={clientDisplayData}
          />
          
          <ClientTabsContainer 
            onShowCalculation={handleShowCalculation}
            clientId={client.id}
            clientName={`${client.prenom} ${client.nom}`}
          />
        </>
      )}
    </div>
  );
};

export default ClientDetailsView;
