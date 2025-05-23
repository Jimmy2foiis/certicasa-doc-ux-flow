
import { useState, useEffect } from 'react';
import { AdministrativeDocument } from '@/types/documents';
import { getDocumentsForClient } from '@/services/api/documentService';

// Structure fixe des 8 documents obligatoires dans l'ordre exact
const REQUIRED_DOCUMENT_TEMPLATES = [
  {
    id: 'doc1',
    name: 'Ficha',
    type: 'ficha',
    reference: 'Ficha RES020.pdf',
    description: 'Document principal de la fiche RES020',
    order: 1,
  },
  {
    id: 'doc2',
    name: 'Anexo I',
    type: 'anexo',
    reference: 'Anexo I de las fichas_DR subvenciones.pdf',
    description: 'Annexe I des fiches de subvention',
    order: 2,
  },
  {
    id: 'doc3',
    name: 'Factura',
    type: 'factura',
    reference: 'Factura.png',
    description: 'Facture du client',
    order: 3,
  },
  {
    id: 'doc4',
    name: 'Informe fotográfico',
    type: 'photos',
    reference: '4-Fotos.docx',
    description: 'Rapport photographique du chantier',
    order: 4,
  },
  {
    id: 'doc5',
    name: 'Certificado de obra',
    type: 'certificado',
    reference: 'Certificado Instalador RES020.docx',
    description: 'Certificat d\'installation RES020',
    order: 5,
  },
  {
    id: 'doc6',
    name: 'CEEE',
    type: 'ceee',
    reference: 'CEEE inicial.pdf + CEEE final.pdf',
    description: 'Certificats énergétiques initial et final',
    order: 6,
  },
  {
    id: 'doc7',
    name: 'Acuerdo de cesión de ahorros',
    type: 'acuerdo',
    reference: 'Modelo ACUERDO SOBRE CESION AHORROS.docx',
    description: 'Accord de cession des économies',
    order: 7,
  },
  {
    id: 'doc8',
    name: 'DNI CLIENTE',
    type: 'dni',
    reference: 'DNI NOM_CLIENT.jpeg',
    description: 'Document d\'identité du client',
    order: 8,
  },
];

export const useRequiredDocuments = (clientId?: string) => {
  const [requiredDocuments, setRequiredDocuments] = useState<AdministrativeDocument[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<AdministrativeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDocuments = async () => {
      setIsLoading(true);
      
      // Création des documents requis basée sur le template
      const requiredDocs = REQUIRED_DOCUMENT_TEMPLATES.map(template => ({
        id: template.id,
        name: template.name,
        type: template.type,
        status: 'missing' as const,
        description: template.description,
        reference: template.reference,
        order: template.order,
        created_at: new Date().toISOString(),
        category: 'required',
      }));

      // Si nous avons un ID client, cherchons ses documents existants
      if (clientId) {
        try {
          const clientDocuments = await getDocumentsForClient(clientId);
          setExistingDocuments(clientDocuments);
          
          // Mettre à jour le statut des documents requis si des documents existants correspondent
          const updatedRequiredDocs = requiredDocs.map(reqDoc => {
            const existingDoc = clientDocuments.find(doc => doc.type === reqDoc.type);
            if (existingDoc) {
              return {
                ...reqDoc,
                id: existingDoc.id || reqDoc.id,
                status: existingDoc.status || 'generated',
                content: existingDoc.content,
                file_path: existingDoc.file_path,
              };
            }
            return reqDoc;
          });
          
          setRequiredDocuments(updatedRequiredDocs);
        } catch (error) {
          console.error('Erreur lors du chargement des documents du client:', error);
          setRequiredDocuments(requiredDocs);
        }
      } else {
        setRequiredDocuments(requiredDocs);
      }
      
      setIsLoading(false);
    };

    initializeDocuments();
  }, [clientId]);

  // Calculer les statistiques des documents
  const documentStats = {
    total: 8,
    generated: requiredDocuments.filter(doc => doc.status === 'generated' || doc.status === 'available').length,
    missing: requiredDocuments.filter(doc => doc.status === 'missing').length,
    error: requiredDocuments.filter(doc => doc.status === 'error' || doc.status === 'action-required').length,
  };

  return {
    requiredDocuments,
    existingDocuments,
    documentStats,
    isLoading,
    documentTemplates: REQUIRED_DOCUMENT_TEMPLATES,
  };
};
