
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface QueuedClient {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
  nif?: string;
  surface?: number;
  cae?: number;
  price?: number;
  addedAt: string;
}

export const useCertificateQueue = () => {
  const [queuedClients, setQueuedClients] = useState<QueuedClient[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const { toast } = useToast();

  // Charger la file d'attente depuis le localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('certificate-queue');
    if (saved) {
      try {
        setQueuedClients(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur lors du chargement de la file d\'attente:', error);
      }
    }
  }, []);

  // Sauvegarder la file d'attente dans le localStorage
  useEffect(() => {
    localStorage.setItem('certificate-queue', JSON.stringify(queuedClients));
  }, [queuedClients]);

  const addToQueue = (client: any) => {
    const queuedClient: QueuedClient = {
      id: client.id,
      name: client.name,
      email: client.email,
      address: client.address,
      phone: client.phone,
      nif: client.nif,
      surface: Math.floor(Math.random() * 50) + 50, // Simulation
      cae: -(Math.floor(Math.random() * 500) + 800), // Simulation
      price: -(Math.floor(Math.random() * 100) + 80), // Simulation
      addedAt: new Date().toISOString()
    };

    setQueuedClients(prev => {
      // Vérifier si le client n'est pas déjà dans la file
      if (prev.find(c => c.id === client.id)) {
        toast({
          title: "Client déjà ajouté",
          description: "Ce client est déjà dans la file d'attente",
          variant: "default",
        });
        return prev;
      }

      toast({
        title: "Client ajouté",
        description: `${client.name} a été ajouté à la file d'attente CEE`,
      });

      return [...prev, queuedClient];
    });
  };

  const removeFromQueue = (clientId: string) => {
    setQueuedClients(prev => prev.filter(c => c.id !== clientId));
    setSelectedClients(prev => prev.filter(id => id !== clientId));
    
    toast({
      title: "Client retiré",
      description: "Le client a été retiré de la file d'attente",
    });
  };

  const isInQueue = (clientId: string) => {
    return queuedClients.some(c => c.id === clientId);
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const selectAll = () => {
    setSelectedClients(queuedClients.map(c => c.id));
  };

  const deselectAll = () => {
    setSelectedClients([]);
  };

  const sendCertificates = async (thermicianId: string) => {
    const selectedClientsData = queuedClients.filter(c => selectedClients.includes(c.id));
    
    // Simulation de l'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Retirer les clients envoyés de la file
    setQueuedClients(prev => prev.filter(c => !selectedClients.includes(c.id)));
    setSelectedClients([]);
    
    toast({
      title: "Certificats envoyés",
      description: `${selectedClientsData.length} certificat(s) envoyé(s) avec succès`,
    });
  };

  return {
    queuedClients,
    selectedClients,
    addToQueue,
    removeFromQueue,
    isInQueue,
    toggleClientSelection,
    selectAll,
    deselectAll,
    sendCertificates,
    selectedCount: selectedClients.length,
    totalCount: queuedClients.length
  };
};
