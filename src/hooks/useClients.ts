
import { useEffect, useState } from "react";

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

        const response = await fetch("https://certicasa.mitain.com/api/prospects", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        
        // Access the data array from the response structure
        const clientsData = responseData.data || [];
        
        // Map the external API data to match our expected interface
        const mappedData: ProspectRow[] = clientsData.map((client: any) => ({
          id: client.id || client._id || "",
          prenom: client.prenom || "",
          nom: client.nom || "",
          email: client.email || null,
          tel: client.tel || client.telephone || null,
          ville: client.ville || null,
          status: client.status || "DONNEE_RECUPEREE",
          _count: { File: client.File?.length || 0 }
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
