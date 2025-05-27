
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface CertificateQueueItem {
  id: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  surfaceArea: number;
  uValueBefore: number;
  uValueAfter: number;
  climateZone: string;
  annualSavings: number;
  improvementPercent: number;
  addedDate: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
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
  const addToQueue = useCallback((certificateData: Omit<CertificateQueueItem, 'id' | 'addedDate' | 'status'>) => {
    const newCertificate: CertificateQueueItem = {
      ...certificateData,
      id: `cert_${Date.now()}`,
      addedDate: new Date().toISOString(),
      status: 'pending'
    };

    const currentQueue = getQueue();
    const updatedQueue = [...currentQueue, newCertificate];
    saveQueue(updatedQueue);

    // Show success toast with navigation option
    toast({
      title: "Certificat ajouté à la liste d'envoi",
      description: `Le certificat pour ${certificateData.clientName} a été ajouté à la queue d'envoi.`,
      duration: 5000,
      action: {
        altText: "Aller au suivi des envois",
        onClick: () => navigate('/energy-certificates/suivi')
      }
    });

    return newCertificate;
  }, [getQueue, saveQueue, toast, navigate]);

  // Get pending certificates count
  const getPendingCount = useCallback(() => {
    const queue = getQueue();
    return queue.filter(cert => cert.status === 'pending').length;
  }, [getQueue]);

  return {
    addToQueue,
    getQueue,
    getPendingCount
  };
};
