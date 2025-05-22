
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
        
        const response = await fetch(`https://certicasa.mitain.com/api/prospects/${clientId}`, {
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Accéder aux données du client depuis la réponse, en vérifiant la propriété data
        const clientData = responseData.data || responseData;
        
        if (!clientData) {
          throw new Error("Aucune donnée client reçue");
        }
        
        // Mapper les données de l'API externe à notre interface
        const mappedClient: ClientDetail = {
          id: clientData.id || "",
          beetoolToken: clientData.beetoolToken || "",
          prenom: clientData.prenom || "",
          nom: clientData.nom || "",
          sexe: clientData.sexe || null,
          adresse: clientData.adresse || "",
          codePostal: clientData.codePostal || "",
          ville: clientData.ville || "",
          pays: clientData.pays || "",
          tel: clientData.tel || null,
          email: clientData.email || null,
          cadastralReference: clientData.cadastralReference || null,
          utm30: clientData.utm30 || null,
          safetyCultureAuditId: clientData.safetyCultureAuditId || null,
          geoPosition: clientData.geoPosition || null,
          status: clientData.status || "",
          createdAt: clientData.createdAt || new Date().toISOString(),
          updatedAt: clientData.updatedAt || new Date().toISOString(),
          File: clientData.File || [],
          GoogleDriveFolder: clientData.GoogleDriveFolder || null
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
