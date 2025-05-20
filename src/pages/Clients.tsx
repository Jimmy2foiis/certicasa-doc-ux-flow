
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsSection from "@/components/clients/ClientsSection";
import { useToast } from "@/components/ui/use-toast";

const Clients = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Afficher une notification concernant la clé API Google Maps
    toast({
      title: "Google Maps API",
      description: "L'autocomplétion des adresses utilise une clé API de démonstration avec des limitations. Pour une utilisation complète, vous devrez configurer votre propre clé API Google Maps.",
      duration: 10000,
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
