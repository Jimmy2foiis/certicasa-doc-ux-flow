
import { useEffect, useState } from "react";

export interface ClientDetail {
  id: string;
  beetoolToken: string;
  prenom: string;
  nom: string;
  sexe: string | null;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  tel: string | null;
  email: string | null;
  cadastralReference: string | null;
  utm30: string | null;
  safetyCultureAuditId: string | null;
  geoPosition: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  File: any[];
  GoogleDriveFolder: any | null;
}

export const useClientDetails = (clientId: string | null) => {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/clients/${clientId}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = (await res.json()) as ClientDetail;
        setClient(data);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  return { client, loading, error, refetch: () => setLoading(true) };
};
