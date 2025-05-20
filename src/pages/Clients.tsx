
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsSection from "@/components/clients/ClientsSection";
import { useToast } from "@/components/ui/use-toast";

const Clients = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Afficher une notification concernant l'intégration de l'API Catastro
    toast({
      title: "API Catastro Español",
      description: "L'application est maintenant connectée à l'API officielle du Catastro Español pour récupérer les données cadastrales authentiques basées sur l'adresse.",
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
