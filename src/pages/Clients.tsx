
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsSection from "@/components/clients/ClientsSection";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/services/supabaseService";

const Clients = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Vérifier la connexion Supabase
    const checkSupabaseConnection = async () => {
      try {
        // Test simple pour vérifier si la connexion fonctionne
        const { data, error } = await supabase.from('clients').select('count', { count: 'exact', head: true });
        
        if (!error) {
          toast({
            title: "Base de données connectée",
            description: "Connexion Supabase établie avec succès. Les données cadastrales seront synchronisées.",
            duration: 5000,
          });
        } else {
          toast({
            title: "Erreur de connexion à la base de données",
            description: "Impossible de se connecter à Supabase. Les données seront stockées localement.",
            variant: "destructive",
            duration: 8000,
          });
          console.error("Erreur Supabase:", error);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la connexion Supabase:", error);
      }
    };
    
    // Afficher une notification concernant l'intégration de l'API Catastro et Google Maps
    toast({
      title: "API Catastro & Google Maps",
      description: "L'application utilise la dernière version de Google Maps Geocoding API pour géolocaliser les adresses et l'API du Catastro Español pour les données cadastrales.",
      duration: 8000,
    });
    
    checkSupabaseConnection();
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
