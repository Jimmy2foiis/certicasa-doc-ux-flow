
import { useState } from 'react';
import { AdministrativeDocument, DocumentStatus } from '@/types/documents';

export const useDemoDocuments = () => {
  const [demoDocuments, setDemoDocuments] = useState<AdministrativeDocument[]>([]);
  
  // Function to determine document category based on type
  const determineDocumentCategory = (type: string): string => {
    const typeCategories: Record<string, string> = {
      'facture': 'billing',
      'reçu': 'billing',
      'devis': 'quotes',
      'contrat': 'contracts',
      'certificat': 'certificates',
      'ficha': 'cadastral',
      'annexo': 'cadastral',
      'nota': 'legal',
      'permis': 'permits'
    };
    
    return typeCategories[type.toLowerCase()] || 'other';
  };
  
  // Function to generate mock status and label
  const generateMockStatus = (): {status: DocumentStatus, label?: string} => {
    const statuses: DocumentStatus[] = ['generated', 'ready', 'pending', 'missing', 'action-required', 'error', 'linked'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[randomIndex];
    
    let label;
    switch(status) {
      case 'action-required':
        label = 'Nécessite votre attention';
        break;
      case 'pending':
        label = 'En attente de traitement';
        break;
      case 'missing':
        label = 'Document manquant';
        break;
      default:
        label = undefined;
    }
    
    return { status, label };
  };
  
  // Function to generate demo documents for a client
  const generateDemoDocuments = (clientId: string): AdministrativeDocument[] => {
    const documentTypes = [
      { name: 'Facture d\'installation', type: 'facture' },
      { name: 'Contrat de travaux', type: 'contrat' },
      { name: 'Permis de construction', type: 'permis' },
      { name: 'Fiche Cadastrale', type: 'ficha' },
      { name: 'Certificat de conformité', type: 'certificat' },
      { name: 'Annexe technique', type: 'annexo' },
      { name: 'Note légale', type: 'nota' },
      { name: 'Devis initial', type: 'devis' },
      { name: 'Reçu de paiement', type: 'reçu' }
    ];
    
    const docs = documentTypes.map((docType, index) => {
      const { status, label } = generateMockStatus();
      
      return {
        id: `doc_${clientId}_${index}`,
        name: docType.name,
        type: docType.type,
        description: `Description pour ${docType.name.toLowerCase()}`,
        status,
        statusLabel: label,
        order: index + 1,
        category: determineDocumentCategory(docType.type)
      };
    });
    
    return docs;
  };
  
  return {
    demoDocuments,
    generateDemoDocuments,
    determineDocumentCategory
  };
};
