
import { useState, useEffect } from 'react';
import { AdministrativeDocument } from '@/types/documents';
import { useDemoDocuments } from './useDemoDocuments'; 

export const useClientDocuments = (clientId: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<AdministrativeDocument[]>([]);
  const { generateDemoDocuments, determineDocumentCategory } = useDemoDocuments();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!clientId) return;
      
      setLoading(true);
      
      try {
        // For demo purposes, generate mock documents with a delay
        setTimeout(() => {
          const demoDocuments = generateDemoDocuments(clientId);
          setDocuments(demoDocuments);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching client documents:', error);
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [clientId, generateDemoDocuments]);

  const addDocument = (document: AdministrativeDocument) => {
    setDocuments(prev => [...prev, document]);
  };
  
  const updateDocument = (updatedDoc: AdministrativeDocument) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc)
    );
  };

  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  return {
    loading,
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    determineDocumentCategory
  };
};
