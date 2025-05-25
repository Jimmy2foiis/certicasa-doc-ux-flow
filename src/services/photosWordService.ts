
import { Document, Packer, Paragraph, ImageRun, Table, TableRow, TableCell, WidthType, HeightRule, AlignmentType, TextRun } from 'docx';
import type { SelectedPhoto, PhotosReportData } from '@/types/safetyCulture';

export const generatePhotosWordDocument = async (reportData: PhotosReportData): Promise<Blob> => {
  try {
    // Fonction corrigée pour télécharger et convertir une image en ArrayBuffer
    const fetchImageAsArrayBuffer = async (imageUrl: string): Promise<ArrayBuffer> => {
      try {
        const response = await fetch(imageUrl, {
          headers: {
            'Accept': 'image/*',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load image from ${imageUrl}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType?.startsWith('image/')) {
          throw new Error('Response is not an image');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        if (arrayBuffer.byteLength < 100) {
          throw new Error('Image data too small');
        }
        
        return arrayBuffer;
        
      } catch (error) {
        console.error(`Failed to fetch image from ${imageUrl}:`, error);
        throw error;
      }
    };

    // Fonction avec retry pour plus de robustesse
    const fetchImageWithRetry = async (url: string, maxRetries = 3): Promise<ArrayBuffer> => {
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await fetchImageAsArrayBuffer(url);
        } catch (error) {
          lastError = error as Error;
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
      
      throw lastError;
    };

    // Télécharger toutes les photos avec gestion d'erreur robuste
    console.log('Fetching AVANT photos...');
    const avantPhotosBuffers = await Promise.all(
      reportData.photosAvant.map(photo => fetchImageWithRetry(photo.photo.url))
    );
    
    console.log('Fetching APRÈS photos...');
    const apresPhotosBuffers = await Promise.all(
      reportData.photosApres.map(photo => fetchImageWithRetry(photo.photo.url))
    );

    // Fonction pour créer une grille 2x2 d'images
    const create2x2Grid = (images: ArrayBuffer[], title: string) => {
      const rows: TableRow[] = [];
      
      for (let i = 0; i < 2; i++) {
        const cells: TableCell[] = [];
        for (let j = 0; j < 2; j++) {
          const imageIndex = i * 2 + j;
          
          cells.push(new TableCell({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: images[imageIndex],
                    transformation: {
                      width: 250,
                      height: 250
                    },
                    type: "jpg"
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ],
            width: { size: 50, type: WidthType.PERCENTAGE }
          }));
        }
        rows.push(new TableRow({ 
          children: cells,
          height: { value: 3000, rule: HeightRule.EXACT }
        }));
      }

      return new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      });
    };

    // Créer le document avec la structure corrigée
    const doc = new Document({
      sections: [
        {
          children: [
            // Titre
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "FOTOS ACTUACIÓN", 
                  bold: true, 
                  size: 32 
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            
            // Ref catastral
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `Ref catastral: ${reportData.refCatastral || 'N/A'}`, 
                  size: 24 
                })
              ],
              spacing: { after: 200 }
            }),
            
            // Coordenadas UTM
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `Coordenadas UTM: ${reportData.coordenadasUTM || 'N/A'}`, 
                  size: 24 
                })
              ],
              spacing: { after: 400 }
            }),
            
            // Espacement
            new Paragraph({ text: "" }),
            
            // Section ANTES
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "ANTES", 
                  bold: true, 
                  size: 28 
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            
            // Grille 2x2 pour photos AVANT
            create2x2Grid(avantPhotosBuffers, "ANTES"),
            
            // Saut de page
            new Paragraph({
              pageBreakBefore: true
            }),
            
            // Section DESPUÉS
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "DESPUÉS", 
                  bold: true, 
                  size: 28 
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            
            // Grille 2x2 pour photos APRÈS
            create2x2Grid(apresPhotosBuffers, "DESPUÉS")
          ]
        }
      ]
    });

    console.log('Generating Word document...');
    // Générer le blob
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    console.log('Document generated successfully');
    return blob;
    
  } catch (error) {
    console.error('Erreur lors de la génération du document Word:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate document: ${errorMessage}`);
  }
};
