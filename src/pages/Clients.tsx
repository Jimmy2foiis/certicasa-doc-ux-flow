
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsSection from "@/components/clients/ClientsSection";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { AddressAutocompleteTest } from "@/components/address/AddressAutocompleteTest";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Clients = () => {
  const { toast } = useToast();
  const [showAutocompleteTest, setShowAutocompleteTest] = useState(false);
  
  useEffect(() => {
    // Notification concernant l'intégration de l'API Catastro et Google Maps
    toast({
      title: "API Catastro & Google Maps",
      description: "L'application utilise la dernière version de Google Maps Geocoding API pour géolocaliser les adresses et l'API du Catastro Español pour les données cadastrales.",
      duration: 8000,
    });
  }, [toast]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Gestion des Clients</h1>
            <Dialog open={showAutocompleteTest} onOpenChange={setShowAutocompleteTest}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Map size={16} />
                  <span>Tester l'autocomplétion d'adresse</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Test d'autocomplétion d'adresse</DialogTitle>
                  <DialogDescription>
                    Utilisez cet outil pour tester le fonctionnement de l'autocomplétion Google Maps
                  </DialogDescription>
                </DialogHeader>
                <AddressAutocompleteTest />
              </DialogContent>
            </Dialog>
          </div>
          
          <ClientsSection />
        </main>
      </div>
    </div>
  );
};

export default Clients;
