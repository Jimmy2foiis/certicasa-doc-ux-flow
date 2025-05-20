
import { 
  ArrowLeft, 
  User, 
  Home, 
  FileText, 
  Receipt, 
  BarChart, 
  Calculator 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ClientInfoTab from "./ClientInfoTab";
import ProjectsTab from "./ProjectsTab";
import CalculationsTab from "./CalculationsTab";
import DocumentsTab from "./DocumentsTab";
import BillingTab from "./BillingTab";
import StatisticsTab from "./StatisticsTab";
import ProjectCalculationView from "./ProjectCalculationView";
import { useClientData } from "@/hooks/useClientData";

interface ClientDetailsViewProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetailsView = ({ clientId, onBack }: ClientDetailsViewProps) => {
  const { client, clientAddress, setClientAddress, savedCalculations, loadingCadastral, utmCoordinates, cadastralReference, climateZone } = useClientData(clientId);
  const [showCalculations, setShowCalculations] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("client-info");
  const { toast } = useToast();

  // Fonction pour mettre à jour l'adresse et rafraîchir les données cadastrales
  const handleAddressChange = (newAddress: string) => {
    setClientAddress(newAddress);
    
    // Afficher une notification
    toast({
      title: "Adresse mise à jour",
      description: "Les données cadastrales sont en cours de mise à jour...",
      duration: 3000
    });
  };

  // Ouvrir un calcul existant ou en créer un nouveau
  const handleShowCalculation = (projectId?: string) => {
    setCurrentProjectId(projectId || null);
    setShowCalculations(true);
  };
  
  // Fonction pour sauvegarder un nouveau calcul
  const saveCalculation = (calculationData: any) => {
    try {
      // Générer un ID unique pour ce calcul
      const calculationId = `calc_${Date.now()}`;
      const projectNumber = savedCalculations.length + 1;
      
      const newCalculation = {
        id: calculationId,
        projectId: currentProjectId || `project_${projectNumber}`,
        projectName: `Réhabilitation Énergétique #${projectNumber}`,
        clientId: clientId,
        type: calculationData.projectType || "RES010",
        surface: parseFloat(calculationData.surfaceArea) || 120,
        date: new Date().toLocaleDateString('fr-FR'),
        improvement: calculationData.improvementPercent || 35,
        calculationData: calculationData
      };
      
      // Récupérer tous les calculs existants
      const savedData = localStorage.getItem('saved_calculations');
      let allCalculations = [];
      
      if (savedData) {
        allCalculations = JSON.parse(savedData);
      }
      
      // Ajouter ou mettre à jour le calcul
      const existingIndex = allCalculations.findIndex((c: any) => 
        c.clientId === clientId && c.projectId === newCalculation.projectId);
      
      if (existingIndex >= 0) {
        allCalculations[existingIndex] = newCalculation;
      } else {
        allCalculations.push(newCalculation);
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));
      
      // Afficher un message de succès
      toast({
        title: "Calcul sauvegardé",
        description: "Les données du calcul ont été enregistrées avec succès.",
        duration: 3000
      });
      
      // Retourner à la liste des calculs
      setShowCalculations(false);
      setCurrentProjectId(null);
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du calcul:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du calcul.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  if (!client) return null;

  if (showCalculations) {
    return <ProjectCalculationView 
      client={{...client, climateZone}} 
      clientId={clientId}
      currentProjectId={currentProjectId}
      savedCalculations={savedCalculations}
      onBack={() => setShowCalculations(false)}
      onSave={saveCalculation}
    />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-semibold">Fiche Client</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Modifier</Button>
          <Button className="bg-green-600 hover:bg-green-700">Nouveau Projet</Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
          <TabsTrigger value="client-info" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Fiche Client</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Projets</span>
          </TabsTrigger>
          <TabsTrigger value="calculations" className="flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            <span>Calculs</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <Receipt className="h-4 w-4" />
            <span>Facturation</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Statistiques</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="client-info">
          <ClientInfoTab 
            client={client} 
            utmCoordinates={utmCoordinates} 
            cadastralReference={cadastralReference} 
            climateZone={climateZone} 
            loadingCadastral={loadingCadastral}
            onShowCalculation={handleShowCalculation}
            onAddressChange={handleAddressChange}
          />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsTab clientId={clientId} />
        </TabsContent>

        <TabsContent value="calculations">
          <CalculationsTab 
            clientId={clientId} 
            savedCalculations={savedCalculations} 
            onOpenCalculation={handleShowCalculation} 
            onCreateNewCalculation={() => handleShowCalculation()} 
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab clientId={clientId} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab clientId={clientId} />
        </TabsContent>

        <TabsContent value="statistics">
          <StatisticsTab clientId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailsView;
