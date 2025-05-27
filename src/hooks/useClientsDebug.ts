
/**
 * Hook spécialisé pour le debug des opérations clients
 */
import { useState, useEffect } from 'react';
import { Client } from '@/services/api/types';
import { clientsApiService } from '@/services/api/clients/clientsApiService';
import { apiDebugger } from '@/services/api/debug/apiDebugger';

export interface ClientsDebugInfo {
  loading: boolean;
  clients: Client[];
  error: string | null;
  apiLogs: any[];
  lastFetchTime: string | null;
  fetchCount: number;
}

export const useClientsDebug = () => {
  const [debugInfo, setDebugInfo] = useState<ClientsDebugInfo>({
    loading: false,
    clients: [],
    error: null,
    apiLogs: [],
    lastFetchTime: null,
    fetchCount: 0
  });

  const fetchClients = async () => {
    console.group('🔍 useClientsDebug.fetchClients()');
    
    setDebugInfo(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      fetchCount: prev.fetchCount + 1
    }));

    try {
      console.log(`📊 Fetch attempt #${debugInfo.fetchCount + 1}`);
      
      const clients = await clientsApiService.getAllClients();
      
      setDebugInfo(prev => ({
        ...prev,
        loading: false,
        clients,
        lastFetchTime: new Date().toISOString(),
        apiLogs: apiDebugger.getLogs()
      }));
      
      console.log('✅ useClientsDebug.fetchClients() completed successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setDebugInfo(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        apiLogs: apiDebugger.getLogs()
      }));
      
      console.error('❌ useClientsDebug.fetchClients() failed:', error);
    } finally {
      console.groupEnd();
    }
  };

  const clearDebugLogs = () => {
    apiDebugger.clearLogs();
    setDebugInfo(prev => ({ ...prev, apiLogs: [] }));
  };

  const resetDebugInfo = () => {
    setDebugInfo({
      loading: false,
      clients: [],
      error: null,
      apiLogs: [],
      lastFetchTime: null,
      fetchCount: 0
    });
    clearDebugLogs();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    ...debugInfo,
    fetchClients,
    clearDebugLogs,
    resetDebugInfo
  };
};
