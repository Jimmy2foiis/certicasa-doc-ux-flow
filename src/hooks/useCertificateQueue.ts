
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

export const useCertificateQueue = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get queue from localStorage
  const getQueue = useCallback((): CertificateQueueItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading certificate queue:', error);
      return [];
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
      action: {
        altText: "Aller au suivi",
        onClick: () => navigate('/certificats-energetiques/suivi')
      }
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
