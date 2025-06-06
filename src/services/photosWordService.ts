import { Document, Packer, Paragraph, ImageRun, Table, TableRow, TableCell, WidthType, HeightRule, AlignmentType, TextRun } from 'docx';
import type { SelectedPhoto, PhotosReportData } from '@/types/safetyCulture';

export const generatePhotosWordDocument = async (reportData: PhotosReportData): Promise<Blob> => {
  try {
    console.log('Début génération DOCX avec photos:', {
      avantCount: reportData.photosAvant.length,
      apresCount: reportData.photosApres.length
    });

    // Fonction pour télécharger et convertir une image en Uint8Array (séquentiel)
    const fetchImageAsUint8Array = async (imageUrl: string): Promise<Uint8Array> => {
      try {
        console.log('Chargement image:', imageUrl);
        
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
        
        // Utiliser Uint8Array directement pour éviter les références circulaires
        const uint8Array = new Uint8Array(arrayBuffer);
        console.log('Image chargée, taille:', uint8Array.length);
        return uint8Array;
        
      } catch (error) {
        console.error(`Failed to fetch image from ${imageUrl}:`, error);
        throw error;
      }
    };

    // Chargement séquentiel des photos AVANT
    console.log('Fetching AVANT photos sequentially...');
    const avantPhotosBuffers: Uint8Array[] = [];
    for (const photo of reportData.photosAvant) {
      try {
        const buffer = await fetchImageAsUint8Array(photo.photo.url);
        avantPhotosBuffers.push(buffer);
      } catch (error) {
        console.error('Erreur chargement photo AVANT:', error);
        throw new Error(`Impossible de charger la photo AVANT: ${photo.photo.url}`);
      }
    }
    
    // Chargement séquentiel des photos APRÈS
    console.log('Fetching APRÈS photos sequentially...');
    const apresPhotosBuffers: Uint8Array[] = [];
    for (const photo of reportData.photosApres) {
      try {
        const buffer = await fetchImageAsUint8Array(photo.photo.url);
        apresPhotosBuffers.push(buffer);
      } catch (error) {
        console.error('Erreur chargement photo APRÈS:', error);
        throw new Error(`Impossible de charger la photo APRÈS: ${photo.photo.url}`);
      }
    }

    // Fonction pour créer une grille 2x2 d'images
    const create2x2GridProfessional = (images: Uint8Array[], title: string) => {
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
                      width: 240,
                      height: 320
                    },
                    type: "jpg"
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 }
              })
            ],
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
            verticalAlign: "center"
          }));
        }
        
        rows.push(new TableRow({ 
          children: cells,
          height: { value: 5000, rule: HeightRule.EXACT }
        }));
      }

      return new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: "single", size: 1, color: "000000" },
          bottom: { style: "single", size: 1, color: "000000" },
          left: { style: "single", size: 1, color: "000000" },
          right: { style: "single", size: 1, color: "000000" },
          insideHorizontal: { style: "single", size: 1, color: "000000" },
          insideVertical: { style: "single", size: 1, color: "000000" },
        }
      });
    };

    // Créer le document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: [
            // Titre principal
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "FOTOS ACTUACIÓN", 
                  bold: true, 
                  size: 36 
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
            
            // Section ANTES
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "ANTES", 
                  bold: true, 
                  size: 32 
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),
            
            // Grille 2x2 pour photos AVANT avec bordures
            create2x2GridProfessional(avantPhotosBuffers, "ANTES"),
            
            // Saut de page
            new Paragraph({
              text: "",
              pageBreakBefore: true
            }),
            
            // Section DESPUÉS
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "DESPUÉS", 
                  bold: true, 
                  size: 32 
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),
            
            // Grille 2x2 pour photos APRÈS avec bordures
            create2x2GridProfessional(apresPhotosBuffers, "DESPUÉS")
          ]
        }
      ]
    });

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
