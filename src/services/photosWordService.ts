
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
                                width: 213, // 7.5cm en points
                                height: 284  // 10cm en points
                              }
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
                                width: 213,
                                height: 284
                              }
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
                                width: 213,
                                height: 284
                              }
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
                                width: 213,
                                height: 284
                              }
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
                                width: 213,
                                height: 284
                              }
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
                                width: 213,
                                height: 284
                              }
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
                                width: 213,
                                height: 284
                              }
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
                                width: 213,
                                height: 284
                              }
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
