
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
        const res = await fetch("/api/clients");
        if (!res.ok) throw new Error("API error");
        const data = (await res.json()) as ProspectRow[];
        setClients(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return { clients, loading, error };
};
