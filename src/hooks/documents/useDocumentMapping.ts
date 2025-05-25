
import { useState, useEffect } from 'react';
import type { AdministrativeDocument, DocumentStatus } from '@/types/documents';

interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  reference: string;
  order: number;
  type: string;
}

const REQUIRED_DOCUMENTS_LIST: RequiredDocument[] = [
  { 
    id: "doc-1", 
    name: "Ficha", 
    description: "Document principal CEE", 
    reference: "Ficha RES020.pdf", 
    order: 1,
    type: "ficha"
  },
  { 
    id: "doc-2", 
    name: "Anexo I", 
    description: "Annexe I des fiches", 
    reference: "Anexo I de las fichas_DR subvenciones.pdf", 
    order: 2,
    type: "anexo"
  },
  { 
    id: "doc-3", 
    name: "Factura", 
    description: "Facture des travaux", 
    reference: "Factura.png", 
    order: 3,
    type: "factura"
  },
  { 
    id: "doc-4", 
    name: "Informe fotográfico", 
    description: "Rapport photographique", 
    reference: "4-Fotos.docx", 
    order: 4,
    type: "fotos"
  },
  { 
    id: "doc-5", 
    name: "Certificado de obra", 
    description: "Certificat d'installation", 
    reference: "Certificado Instalador RES020.docx", 
    order: 5,
    type: "certificado"
  },
  { 
    id: "doc-6", 
    name: "CEEE", 
    description: "Certificats d'efficacité énergétique", 
    reference: "CEEE inicial.pdf + CEEE final.pdf", 
    order: 6,
    type: "ceee"
  },
  { 
    id: "doc-7", 
    name: "Acuerdo cesión de ahorros", 
    description: "Accord sur la cession d'économies", 
    reference: "Modelo ACUERDO SOBRE CESION AHORROS.docx", 
    order: 7,
    type: "acuerdo"
  },
  { 
    id: "doc-8", 
    name: "DNI CLIENTE", 
    description: "Document d'identité du client", 
    reference: "DNI NOM_CLIENT.jpeg", 
    order: 8,
    type: "dni"
  },
];

export const useDocumentMapping = (documents: AdministrativeDocument[]) => {
  const [requiredDocuments, setRequiredDocuments] = useState<AdministrativeDocument[]>([]);

  useEffect(() => {
    console.log('🔄 Documents from Supabase:', documents.length);
    
    // Mapping amélioré avec correspondance exacte par type et nom
    const mappedDocuments: AdministrativeDocument[] = REQUIRED_DOCUMENTS_LIST.map(reqDoc => {
      console.log(`🔍 Mapping ${reqDoc.name} (${reqDoc.type})...`);
      
      const existingDoc = documents.find(doc => {
        // Correspondance exacte par type
        const typeMatch = doc.type?.toLowerCase() === reqDoc.type.toLowerCase();
        
        // Correspondance par nom (flexible)
        const nameMatch = doc.name?.toLowerCase().includes(reqDoc.name.toLowerCase()) ||
                          reqDoc.name.toLowerCase().includes(doc.name?.toLowerCase() || '');
        
        // Cas spécial pour "fotos" et "Informe fotográfico"
        const fotosMatch = (reqDoc.type === 'fotos' && 
          (doc.name?.toLowerCase().includes('fotográfico') || 
           doc.name?.toLowerCase().includes('informe') ||
           doc.name?.toLowerCase().includes('fotos') || 
           doc.type?.toLowerCase() === 'fotos'));
           
        const match = typeMatch || nameMatch || fotosMatch;
        
        if (match) {
          console.log(`✅ ${reqDoc.name}: TROUVÉ ->`, doc.name, `(status: ${doc.status})`);
        }
        
        return match;
      });

      if (existingDoc) {
        return {
          ...reqDoc,
          id: existingDoc.id,
          status: existingDoc.status,
          statusLabel: existingDoc.statusLabel,
          created_at: existingDoc.created_at,
          content: existingDoc.content,
          file_path: existingDoc.file_path
        };
      } else {
        console.log(`❌ ${reqDoc.name}: MANQUANT`);
        return {
          ...reqDoc,
          status: "missing" as DocumentStatus,
          statusLabel: "Document manquant",
          created_at: new Date().toISOString()
        };
      }
    });

    console.log('📋 Final mapped documents:', mappedDocuments.map(d => `${d.name}: ${d.status}`));
    setRequiredDocuments(mappedDocuments);
  }, [documents]);

  return { requiredDocuments };
};
