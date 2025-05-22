
import { useEffect, useState } from "react";
import axios from "axios";

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
        const response = await axios.get(`https://certicasa.mitain.com/api/prospects/${clientId}`);
        
        const data = response.data;
        
        // Map the external API data to our interface
        const mappedClient: ClientDetail = {
          id: data.id || "",
          beetoolToken: data.beetoolToken || "",
          prenom: data.prenom || "",
          nom: data.nom || "",
          sexe: data.sexe || null,
          adresse: data.adresse || "",
          codePostal: data.codePostal || "",
          ville: data.ville || "",
          pays: data.pays || "",
          tel: data.tel || null,
          email: data.email || null,
          cadastralReference: data.cadastralReference || null,
          utm30: data.utm30 || null,
          safetyCultureAuditId: data.safetyCultureAuditId || null,
          geoPosition: data.geoPosition || null,
          status: data.status || "",
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          File: data.File || [],
          GoogleDriveFolder: data.GoogleDriveFolder || null
        };
        
        setClient(mappedClient);
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
