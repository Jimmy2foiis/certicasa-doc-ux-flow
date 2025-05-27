
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CertificateQueueItem {
  id: string;
  certificatId: string;
  clientInfo: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  dateAjout: string;
  statut: "en_attente" | "envoye" | "recu" | "erreur";
  thermician?: string;
}

export const useEnergyCertificateQueue = () => {
  const [queue, setQueue] = useState<CertificateQueueItem[]>([]);
  const { toast } = useToast();

  // Charger la queue depuis le localStorage au démarrage
  useEffect(() => {
    const savedQueue = localStorage.getItem('energyCertificateQueue');
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }
  }, []);

  // Sauvegarder la queue dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('energyCertificateQueue', JSON.stringify(queue));
  }, [queue]);

  const addToQueue = (clientInfo: CertificateQueueItem['clientInfo']) => {
    const newItem: CertificateQueueItem = {
      id: `cert-${Date.now()}`,
      certificatId: `CEE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      clientInfo,
      dateAjout: new Date().toISOString(),
      statut: "en_attente"
    };

    setQueue(prev => [...prev, newItem]);
    
    toast({
      title: "Certificat ajouté à la liste d'envoi",
      description: `Le certificat ${newItem.certificatId} pour ${clientInfo.name} est maintenant en attente d'envoi.`,
      duration: 5000,
    });

    return newItem;
  };

  const updateCertificateStatus = (id: string, statut: CertificateQueueItem['statut'], thermician?: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id 
        ? { ...item, statut, ...(thermician && { thermician }) }
        : item
    ));
  };

  const removeCertificate = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const getPendingCount = () => queue.filter(item => item.statut === "en_attente").length;

  const getCertificatesByStatus = (statut: CertificateQueueItem['statut']) => 
    queue.filter(item => item.statut === statut);

  return {
    queue,
    addToQueue,
    updateCertificateStatus,
    removeCertificate,
    getPendingCount,
    getCertificatesByStatus
  };
};
