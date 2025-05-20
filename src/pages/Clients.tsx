
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsSection from "@/components/clients/ClientsSection";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";

const Clients = () => {
  const { toast } = useToast();
  const [databaseConnected, setDatabaseConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Vérifier la connexion Supabase
    const checkSupabaseConnection = async () => {
      try {
        // Test simple pour vérifier si la connexion fonctionne
        const { data, error } = await supabase.from('clients').select('count', { count: 'exact', head: true });
        
        if (!error) {
          setDatabaseConnected(true);
          toast({
            title: "Base de données connectée",
            description: "Connexion Supabase établie avec succès. Les données clients seront synchronisées.",
            duration: 5000,
          });
        } else {
          setDatabaseConnected(false);
          if (error.code === '42501') { // RLS Error
            toast({
              title: "Attention: Problème de permissions",
              description: "Vous n'avez pas les permissions nécessaires dans Supabase. Les clients seront stockés localement.",
              variant: "destructive",
              duration: 8000,
            });
          } else {
            toast({
              title: "Erreur de connexion à la base de données",
              description: "Impossible de se connecter à Supabase. Les données seront stockées localement.",
              variant: "destructive",
              duration: 8000,
            });
          }
          console.error("Erreur Supabase:", error);
        }
      } catch (error) {
        setDatabaseConnected(false);
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
          {databaseConnected === false && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Problème d'accès à la base de données (permissions RLS). Les données seront stockées localement.
                <Button variant="link" className="p-0 h-auto text-white underline ml-1" onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {databaseConnected === true && (
            <Alert variant="default" className="mb-4 bg-green-50 border-green-100">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Base de données connectée. Les clients et données cadastrales seront synchronisés avec Supabase.
              </AlertDescription>
            </Alert>
          )}
          
          <ClientsSection />
        </main>
      </div>
    </div>
  );
};

export default Clients;
