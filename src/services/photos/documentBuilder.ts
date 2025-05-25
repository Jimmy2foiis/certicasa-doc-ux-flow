
import { Document, Paragraph, TextRun, AlignmentType } from 'docx';
import type { PhotosReportData } from '@/types/safetyCulture';
import { create2x2GridProfessional } from './tableBuilder';

export const createPhotosDocument = (
  reportData: PhotosReportData,
  avantPhotosBuffers: Uint8Array[],
  apresPhotosBuffers: Uint8Array[]
): Document => {
  return new Document({
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
};
