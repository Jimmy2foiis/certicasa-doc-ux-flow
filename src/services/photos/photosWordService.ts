
import { Packer } from 'docx';
import type { PhotosReportData } from '@/types/safetyCulture';
import { fetchImagesSequentially } from './imageUtils';
import { createPhotosDocument } from './documentBuilder';

export const generatePhotosWordDocument = async (reportData: PhotosReportData): Promise<Blob> => {
  try {
    console.log('Début génération DOCX avec photos:', {
      avantCount: reportData.photosAvant.length,
      apresCount: reportData.photosApres.length
    });

    // Chargement séquentiel des photos AVANT
    console.log('Fetching AVANT photos sequentially...');
    const avantPhotosBuffers = await fetchImagesSequentially(reportData.photosAvant);
    
    // Chargement séquentiel des photos APRÈS
    console.log('Fetching APRÈS photos sequentially...');
    const apresPhotosBuffers = await fetchImagesSequentially(reportData.photosApres);

    // Créer le document
    const doc = createPhotosDocument(reportData, avantPhotosBuffers, apresPhotosBuffers);

    console.log('Generating Word document...');
    const blob = await Packer.toBlob(doc);
    
    // Déclencher le téléchargement automatiquement
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '4-Fotos.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('Document generated and download triggered successfully');
    return blob;
    
  } catch (error) {
    console.error('Erreur lors de la génération du document Word:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate document: ${errorMessage}`);
  }
};
