
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsSection from "@/components/clients/ClientsSection";
import { useToast } from "@/components/ui/use-toast";

const Clients = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Afficher une notification concernant la configuration de la clé API Google Maps
    toast({
      title: "Configuration Google Maps",
      description: "Pour utiliser l'autocomplétion des adresses, assurez-vous que votre clé API Google Maps est correctement configurée avec les domaines autorisés dans la Google Cloud Console.",
      duration: 8000,
    });
  }, [toast]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <ClientsSection />
        </main>
      </div>
    </div>
  );
};

export default Clients;
