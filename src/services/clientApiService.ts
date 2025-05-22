
// Service pour gérer les appels API aux clients et fichiers associés
import { ClientDetail } from "@/hooks/useClientDetails";

// Interface pour les fichiers
export interface ClientFile {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  folderType: string;
  createdAt: string;
  updatedAt: string;
  subFolderName?: string;
}

// Récupérer les fichiers d'un client par son beetoolToken
export const getClientFiles = async (beetoolToken: string): Promise<ClientFile[]> => {
  try {
    const response = await fetch(`/api/clients/${beetoolToken}/files`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers du client:", error);
    return [];
  }
};

// Mise à jour d'un client
export const updateClient = async (clientId: string, clientData: Partial<ClientDetail>): Promise<ClientDetail | null> => {
  try {
    const response = await fetch(`https://certicasa.mitain.com/api/prospects/${clientId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clientData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    return null;
  }
};

// Sauvegarder des données cadastrales
export interface CadastralData {
  clientId: string;
  utmCoordinates?: string;
  cadastralReference?: string;
  climateZone?: string;
  apiSource?: string;
}

export const saveCadastralData = async (data: CadastralData): Promise<boolean> => {
  // Pour cet exemple, nous simulons la sauvegarde dans localStorage
  try {
    const key = `cadastral_${data.clientId}`;
    localStorage.setItem(key, JSON.stringify({
      ...data,
      createdAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données cadastrales:", error);
    return false;
  }
};

// Récupérer les données cadastrales d'un client
export const getCadastralDataForClient = async (clientId: string): Promise<CadastralData | null> => {
  try {
    const key = `cadastral_${clientId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales:", error);
    return null;
  }
};
