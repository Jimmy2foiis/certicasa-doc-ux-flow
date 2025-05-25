
import { Document, Packer, Paragraph, ImageRun, Table, TableRow, TableCell, WidthType, HeightRule } from 'docx';
import type { SelectedPhoto, PhotosReportData } from '@/types/safetyCulture';

export const generatePhotosWordDocument = async (reportData: PhotosReportData): Promise<Blob> => {
  try {
    // Fonction pour télécharger et convertir une image en buffer
    const imageToBuffer = async (imageUrl: string): Promise<ArrayBuffer> => {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return response.arrayBuffer();
    };

    // Fonction pour détecter le type d'image
    const getImageType = (url: string): 'jpg' | 'png' => {
      return url.toLowerCase().includes('.png') ? 'png' : 'jpg';
    };

    // Télécharger toutes les photos
    const avantPhotosBuffers = await Promise.all(
      reportData.photosAvant.map(photo => imageToBuffer(photo.photo.url))
    );
    
    const apresPhotosBuffers = await Promise.all(
      reportData.photosApres.map(photo => imageToBuffer(photo.photo.url))
    );

    // Créer le document
    const doc = new Document({
      sections: [
        {
          children: [
            // Titre
            new Paragraph({
              text: "FOTOS ACTUACIÓN",
              heading: "Heading1",
              spacing: { after: 400 }
            }),
            
            // Ref catastral
            new Paragraph({
              text: `Ref catastral: ${reportData.refCatastral || 'N/A'}`,
              spacing: { after: 200 }
            }),
            
            // Coordenadas UTM
            new Paragraph({
              text: `Coordenadas UTM: ${reportData.coordenadasUTM || 'N/A'}`,
              spacing: { after: 400 }
            }),
            
            // Section ANTES
            new Paragraph({
              text: "ANTES:",
              heading: "Heading2",
              spacing: { after: 200 }
            }),
            
            // Table 2x2 pour photos AVANT
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  height: { value: 3000, rule: HeightRule.EXACT },
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: avantPhotosBuffers[0],
                              transformation: {
                                width: 283, // ~7.5cm en pixels (96 DPI)
                                height: 377  // ~10cm en pixels (96 DPI)
                              },
                              type: getImageType(reportData.photosAvant[0].photo.url)
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: avantPhotosBuffers[1],
                              transformation: {
                                width: 283,
                                height: 377
                              },
                              type: getImageType(reportData.photosAvant[1].photo.url)
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),
                new TableRow({
                  height: { value: 3000, rule: HeightRule.EXACT },
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: avantPhotosBuffers[2],
                              transformation: {
                                width: 283,
                                height: 377
                              },
                              type: getImageType(reportData.photosAvant[2].photo.url)
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: avantPhotosBuffers[3],
                              transformation: {
                                width: 283,
                                height: 377
                              },
                              type: getImageType(reportData.photosAvant[3].photo.url)
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        },
        {
          children: [
            // Section DESPUÉS
            new Paragraph({
              text: "DESPUÉS:",
              heading: "Heading2",
              spacing: { after: 200 }
            }),
            
            // Table 2x2 pour photos APRÈS
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  height: { value: 3000, rule: HeightRule.EXACT },
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: apresPhotosBuffers[0],
                              transformation: {
                                width: 283,
                                height: 377
                              },
                              type: getImageType(reportData.photosApres[0].photo.url)
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: apresPhotosBuffers[1],
                              transformation: {
                                width: 283,
                                height: 377
                              },
                              type: getImageType(reportData.photosApres[1].photo.url)
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),
                new TableRow({
                  height: { value: 3000, rule: HeightRule.EXACT },
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: apresPhotosBuffers[2],
                              transformation: {
                                width: 283,
                                height: 377
                              },
                              type: getImageType(reportData.photosApres[2].photo.url)
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: apresPhotosBuffers[3],
                              transformation: {
                                width: 283,
                                height: 377
                              },
                              type: getImageType(reportData.photosApres[3].photo.url)
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }
      ]
    });

    // Générer le blob
    const buffer = await Packer.toBuffer(doc);
    return new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  } catch (error) {
    console.error('Erreur lors de la génération du document Word:', error);
    throw error;
  }
};
