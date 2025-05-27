import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from '@/components/ui/toast';

export interface CertificateQueueItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectType: string;
  surfaceArea: number;
  uValueBefore: number;
  uValueAfter: number;
  climateZone: string;
  annualSavings: number;
  improvementPercent: number;
  addedDate: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  energyClass?: string;
  consumption?: number;
  estimatedAmount?: number;
  isUrgent?: boolean;
  reference: string;
}

const STORAGE_KEY = 'certificate_queue';

// Données mockées pour les tests
const getMockedCertificates = (): CertificateQueueItem[] => [
  {
    id: 'cert_1001',
    clientName: 'Jean Dupont',
    clientEmail: 'jean.dupont@email.com',
    clientPhone: '0123456789',
    projectType: 'Isolation combles perdues',
    surfaceArea: 120,
    uValueBefore: 2.5,
    uValueAfter: 0.16,
    climateZone: 'H1',
    annualSavings: 850,
    improvementPercent: 35,
    addedDate: '2025-05-25T10:30:00.000Z',
    status: 'pending',
    energyClass: 'B',
    consumption: 180,
    estimatedAmount: 3200,
    isUrgent: false,
    reference: 'CEE-2024-001'
  },
  {
    id: 'cert_1002',
    clientName: 'Marie Martin',
    clientEmail: 'marie.martin@email.com',
    clientPhone: '0145678912',
    projectType: 'Isolation des murs',
    surfaceArea: 85,
    uValueBefore: 1.8,
    uValueAfter: 0.25,
    climateZone: 'H2',
    annualSavings: 620,
    improvementPercent: 28,
    addedDate: '2025-05-26T14:15:00.000Z',
    status: 'pending',
    energyClass: 'C',
    consumption: 145,
    estimatedAmount: 2800,
    isUrgent: true,
    reference: 'CEE-2024-002'
  },
  {
    id: 'cert_1003',
    clientName: 'Pierre Durand',
    clientEmail: 'pierre.durand@email.com',
    clientPhone: '0167891234',
    projectType: 'Isolation sol',
    surfaceArea: 95,
    uValueBefore: 2.1,
    uValueAfter: 0.20,
    climateZone: 'H1',
    annualSavings: 720,
    improvementPercent: 32,
    addedDate: '2025-05-27T09:45:00.000Z',
    status: 'pending',
    energyClass: 'A',
    consumption: 125,
    estimatedAmount: 4100,
    isUrgent: false,
    reference: 'CEE-2024-003'
  }
];

export const useCertificateQueue = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get queue from localStorage
  const getQueue = useCallback((): CertificateQueueItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Si la queue est vide, ajouter les données mockées
        if (parsed.length === 0) {
          const mockedData = getMockedCertificates();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mockedData));
          return mockedData;
        }
        return parsed;
      } else {
        // Si aucune donnée stockée, initialiser avec les données mockées
        const mockedData = getMockedCertificates();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockedData));
        return mockedData;
      }
    } catch (error) {
      console.error('Error reading certificate queue:', error);
      return getMockedCertificates();
    }
  }, []);

  // Save queue to localStorage
  const saveQueue = useCallback((queue: CertificateQueueItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving certificate queue:', error);
    }
  }, []);

  // Add certificate to queue
  const addToQueue = useCallback((certificateData: Omit<CertificateQueueItem, 'id' | 'addedDate' | 'status' | 'reference'>) => {
    const newCertificate: CertificateQueueItem = {
      ...certificateData,
      id: `cert_${Date.now()}`,
      addedDate: new Date().toISOString(),
      status: 'pending',
      reference: `CEE-2024-${String(Date.now()).slice(-3)}`,
      energyClass: 'C', // Default value
      consumption: Math.round(Math.random() * 200 + 100), // Mock data
      estimatedAmount: Math.round(Math.random() * 5000 + 2000), // Mock data
      isUrgent: Math.random() > 0.7 // 30% chance of being urgent
    };

    const currentQueue = getQueue();
    const updatedQueue = [...currentQueue, newCertificate];
    saveQueue(updatedQueue);

    // Show success toast with navigation action
    toast({
      title: "Certificat ajouté à la liste d'envoi",
      description: `Le certificat pour ${certificateData.clientName} a été ajouté à la queue d'envoi.`,
      duration: 5000,
      action: (
        <ToastAction 
          altText="Aller au suivi"
          onClick={() => navigate('/certificats-energetiques/suivi')}
        >
          Aller au suivi
        </ToastAction>
      )
    });

    return newCertificate;
  }, [getQueue, saveQueue, toast, navigate]);

  // Get pending certificates count
  const getPendingCount = useCallback(() => {
    const queue = getQueue();
    return queue.filter(cert => cert.status === 'pending').length;
  }, [getQueue]);

  // Remove certificates from queue
  const removeFromQueue = useCallback((certificateIds: string[]) => {
    const currentQueue = getQueue();
    const updatedQueue = currentQueue.filter(cert => !certificateIds.includes(cert.id));
    saveQueue(updatedQueue);
  }, [getQueue, saveQueue]);

  return {
    addToQueue,
    getQueue,
    getPendingCount,
    removeFromQueue
  };
};
