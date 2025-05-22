
import { useEffect, useState } from "react";
import axios from "axios";

export interface ProspectRow {
  id: string;
  prenom: string;
  nom: string;
  email: string | null;
  tel: string | null;
  ville: string | null;
  status: string;
  _count: { File: number };
}

export const useClients = () => {
  const [clients, setClients] = useState<ProspectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        // Utiliser directement l'endpoint externe avec proxy CORS
        const response = await axios.get("https://certicasa.mitain.com/api/prospects", {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // Map the external API data to match our expected interface
        const mappedData: ProspectRow[] = response.data.map((client: any) => ({
          id: client.id || client._id || "",
          prenom: client.prenom || "",
          nom: client.nom || "",
          email: client.email || null,
          tel: client.tel || client.telephone || null,
          ville: client.ville || null,
          status: client.status || "DONNEE_RECUPEREE",
          _count: { File: client.files?.length || client._count?.File || 0 }
        }));
        
        setClients(mappedData);
        setError(null);
      } catch (e) {
        console.error("Error fetching clients:", e);
        setError((e as Error).message || "Failed to fetch clients data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);

  return { clients, loading, error };
};
